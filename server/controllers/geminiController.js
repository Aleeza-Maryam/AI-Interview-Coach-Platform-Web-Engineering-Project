import axios from 'axios'

const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent`

// Questions Generate karna
export const generateQuestions = async (req, res) => {
  const { role, level, jobProfile, difficulty } = req.body

  const actualRole = role || jobProfile
  const actualLevel = level || difficulty

  console.log('Generate Questions Called:', actualRole, actualLevel)

  if (!actualRole || !actualLevel) {
    return res.status(400).json({ error: 'Role and level are required' })
  }

  const prompt = `You are a professional interviewer. Generate exactly 10 interview questions for a ${actualRole} position at ${actualLevel} experience level.

Return ONLY a valid JSON array, no extra text, no markdown, no backticks:
["Question 1", "Question 2", "Question 3", "Question 4", "Question 5", "Question 6", "Question 7", "Question 8", "Question 9", "Question 10"]`

  try {
    if (!process.env.GEMINI_API_KEY) {
      return res.status(400).json({ error: 'GEMINI_API_KEY not configured' })
    }

    console.log('Sending request to Gemini API for question generation...')
    const response = await axios.post(
      `${GEMINI_URL}?key=${process.env.GEMINI_API_KEY}`,
      { contents: [{ parts: [{ text: prompt }] }] },
      { timeout: 30000 }
    )

    console.log('Gemini Response Status:', response.status)
    const text = response.data.candidates[0].content.parts[0].text
    console.log('Gemini Raw Response:', text)

    const cleaned = text.replace(/```json|```/g, '').trim()
    const questions = JSON.parse(cleaned)

    res.json({ questions })
  } catch (error) {
    console.error('Generate Error:', error.response?.data || error.message)
    const errorMsg = error.response?.data?.error?.message || error.message || 'Failed to generate questions'
    res.status(500).json({ error: errorMsg })
  }
}

// Answer Evaluate karna
export const evaluateAnswer = async (req, res) => {
  const { question, answer, role, level, jobProfile, difficulty } = req.body

  const actualRole = role || jobProfile
  const actualLevel = level || difficulty

  console.log('Evaluate Answer Called:', actualRole, actualLevel)
  console.log('Question:', question)
  console.log('Answer:', answer)

  if (!question || !answer) {
    return res.status(400).json({ error: 'Question and answer are required' })
  }

  const prompt = `You are an expert interviewer evaluating a ${actualLevel} ${actualRole} candidate.

Question: ${question}
Candidate Answer: ${answer}

Return ONLY a valid JSON object, no extra text, no markdown, no backticks:
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
      return res.status(400).json({ error: 'GEMINI_API_KEY not configured' })
    }

    console.log('Sending request to Gemini API for evaluation...')
    const response = await axios.post(
      `${GEMINI_URL}?key=${process.env.GEMINI_API_KEY}`,
      { contents: [{ parts: [{ text: prompt }] }] },
      { timeout: 30000 }
    )

    console.log('Gemini Response Status:', response.status)
    
    if (!response.data.candidates || !response.data.candidates[0]) {
      console.error('Unexpected Gemini response structure:', response.data)
      return res.status(500).json({ error: 'Invalid response from Gemini API' })
    }

    const text = response.data.candidates[0].content.parts[0].text
    console.log('Gemini Evaluation Response:', text)

    const cleaned = text.replace(/```json|```/g, '').trim()
    console.log('Cleaned JSON:', cleaned)
    
    const evaluation = JSON.parse(cleaned)

    res.json(evaluation)
  } catch (error) {
    console.error('Evaluate Error:', error.response?.data || error.message)
    const errorMsg = error.response?.data?.error?.message || error.message || 'Failed to evaluate answer'
    res.status(500).json({ error: errorMsg })
  }
}