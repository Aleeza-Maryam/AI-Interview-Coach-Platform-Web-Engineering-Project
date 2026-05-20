import express from 'express'
import { saveInterviewReport, getUserHistory, getReportById } from '../controllers/interviewController.js'

const router = express.Router()

router.post('/save-report', saveInterviewReport)
router.get('/user-history/:userId', getUserHistory)
router.get('/report/:id', getReportById)

export default router
