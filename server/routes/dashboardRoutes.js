import express from 'express'
import { saveInterviewReport } from '../controllers/interviewController.js'

const router = express.Router()

// Route pipeline map
router.post('/save-report', saveInterviewReport)

export default router