import axios from 'axios'

const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent`;
// Questions Generate karna
export const generateQuestions = async (req, res) => {
  const { role, level } = req.body

  const prompt = `You are a professional interviewer. Generate exactly 10 interview questions for a ${role} position at ${level} experience level.
  
Return ONLY a JSON array like this, nothing else:
["Question 1", "Question 2", "Question 3", "Question 4", "Question 5", "Question 6", "Question 7", "Question 8", "Question 9", "Question 10"]`

  try {
    const response = await axios.post(
      `${GEMINI_URL}?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [{ parts: [{ text: prompt }] }]
      }
    )

    const text = response.data.candidates[0].content.parts[0].text
    const cleaned = text.replace(/```json|```/g, '').trim()
    const questions = JSON.parse(cleaned)

    res.json({ questions })
  } catch (error) {
    console.error('Gemini error:', error.message)
    res.status(500).json({ error: 'Failed to generate questions' })
  }
}

// Answer Evaluate karna
export const evaluateAnswer = async (req, res) => {
  const { question, answer, role, level } = req.body

  const prompt = `You are an expert interviewer evaluating a ${level} ${role} candidate.

Question: ${question}
Candidate Answer: ${answer}

Evaluate this answer and return ONLY a JSON object like this, nothing else:
{
  "clarity": 7,
  "depth": 6,
  "relevance": 8,
  "overall": 7,
  "feedback": "Your feedback here in 2-3 sentences",
  "strength": "One thing they did well",
  "improvement": "One thing they should improve",
  "needsFollowUp": true,
  "followUpQuestion": "A follow up question if needed, else empty string"
}`

  try {
    const response = await axios.post(
      `${GEMINI_URL}?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [{ parts: [{ text: prompt }] }]
      }
    )

    const text = response.data.candidates[0].content.parts[0].text
    const cleaned = text.replace(/```json|```/g, '').trim()
    const evaluation = JSON.parse(cleaned)

    res.json(evaluation)
  } catch (error) {
    console.error('Gemini error:', error.message)
    res.status(500).json({ error: 'Failed to evaluate answer' })
  }
}