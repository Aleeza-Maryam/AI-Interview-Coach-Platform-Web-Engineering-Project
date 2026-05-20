import axios from "axios"

const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent`

// Questions Generate karna
export const generateQuestions = async (req, res) => {
  const { role, level, jobProfile, difficulty, numQuestions = 10, questionType = "Both" } = req.body

  const actualRole = role || jobProfile
  const actualLevel = level || difficulty
  const questionCount = Math.max(1, Math.min(parseInt(numQuestions) || 10, 20))

  console.log("Generate Questions Called:", actualRole, actualLevel, questionCount, questionType)

  if (!actualRole || !actualLevel) {
    return res.status(400).json({ error: "Role and level are required" })
  }

  let typeInstruction = ""
  if (questionType === "Technical") {
    typeInstruction = "ONLY technical questions focused on coding, algorithms, tools, and technical concepts."
  } else if (questionType === "Behavioral") {
    typeInstruction = "ONLY behavioral and situational questions focused on soft skills, teamwork, problem-solving, and professional scenarios. NO technical coding questions."
  } else {
    typeInstruction = "A mix of both technical and behavioral questions."
  }

  const prompt = `You are a professional interviewer specializing in ${actualRole} positions. Generate EXACTLY ${questionCount} interview questions for a ${actualRole} position at ${actualLevel} experience level.

Question Type: ${typeInstruction}

CRITICAL REQUIREMENTS:
1. Return ONLY a valid JSON array with exactly ${questionCount} questions
2. No extra text, no markdown, no backticks, no explanations
3. Each question should be relevant to ${actualRole} 
4. Difficulty level: ${actualLevel}

Return format (exactly):
["Question 1?", "Question 2?", "Question 3?", ..., "Question ${questionCount}?"]`

  try {
    if (!process.env.GEMINI_API_KEY) {
      return res.status(400).json({ error: "GEMINI_API_KEY not configured" })
    }

    console.log("Sending request to Gemini API for question generation...")
    const response = await axios.post(
      `${GEMINI_URL}?key=${process.env.GEMINI_API_KEY}`,
      { contents: [{ parts: [{ text: prompt }] }] },
      { timeout: 30000 }
    )

    console.log("Gemini Response Status:", response.status)
    const text = response.data.candidates[0].content.parts[0].text
    console.log("Gemini Raw Response:", text.substring(0, 200))

    const cleaned = text.replace(/```json|```/g, "").trim()
    const questions = JSON.parse(cleaned)

    if (!Array.isArray(questions)) {
      return res.status(500).json({ error: "Invalid response format from Gemini" })
    }

    const validQuestions = questions.slice(0, questionCount).filter(q => typeof q === "string" && q.trim().length > 0)

    if (validQuestions.length === 0) {
      return res.status(500).json({ error: "Failed to parse questions from Gemini response" })
    }

    console.log(`Successfully generated ${validQuestions.length} ${questionType} questions`)
    res.json({ questions: validQuestions })
  } catch (error) {
    console.error("Generate Error:", error.response?.data || error.message)
    const errorMsg = error.response?.data?.error?.message || error.message || "Failed to generate questions"
    res.status(500).json({ error: errorMsg })
  }
}

// Answer Evaluate karna
export const evaluateAnswer = async (req, res) => {
  const { question, answer, role, level, jobProfile, difficulty } = req.body

  const actualRole = role || jobProfile
  const actualLevel = level || difficulty

  console.log("Evaluate Answer Called:", actualRole, actualLevel)
  console.log("Question:", question)
  console.log("Answer:", answer.substring(0, 100))

  if (!question || !answer) {
    return res.status(400).json({ error: "Question and answer are required" })
  }

  const prompt = `You are an expert interviewer evaluating a ${actualLevel} ${actualRole} candidate.

Question: ${question}
Candidate Answer: ${answer}

Evaluate the answer and return ONLY a valid JSON object with these exact fields. No extra text, no markdown, no backticks:
{
  "clarity": 7,
  "depth": 6,
  "relevance": 8,
  "overall": 7,
  "feedback": "Your detailed feedback here in 2-3 sentences",
  "strength": "One specific thing they did well",
  "improvement": "One specific thing they should improve",
  "needsFollowUp": true,
  "followUpQuestion": "A relevant follow up question here"
}`

  try {
    if (!process.env.GEMINI_API_KEY) {
      return res.status(400).json({ error: "GEMINI_API_KEY not configured" })
    }

    console.log("Sending request to Gemini API for evaluation...")
    const response = await axios.post(
      `${GEMINI_URL}?key=${process.env.GEMINI_API_KEY}`,
      { contents: [{ parts: [{ text: prompt }] }] },
      { timeout: 30000 }
    )

    console.log("Gemini Response Status:", response.status)

    if (!response.data.candidates || !response.data.candidates[0]) {
      console.error("Unexpected Gemini response structure:", response.data)
      return res.status(500).json({ error: "Invalid response from Gemini API" })
    }

    const evalText = response.data.candidates[0].content.parts[0].text
    const cleanedEval = evalText.replace(/```json|```/g, "").trim()
    const evaluation = JSON.parse(cleanedEval)

    res.json(evaluation)
  } catch (error) {
    console.error("Evaluate Error:", error.response?.data || error.message)
    const errorMsg = error.response?.data?.error?.message || error.message || "Failed to evaluate answer"
    res.status(500).json({ error: errorMsg })
  }
}
