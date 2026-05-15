import express from 'express'
import { generateQuestions, evaluateAnswer } from '../controllers/geminiController.js'

const router = express.Router()

router.post('/generate-questions', generateQuestions)
router.post('/evaluate-answer', evaluateAnswer)

export default router