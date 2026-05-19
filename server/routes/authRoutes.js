import express from 'express'
import { registerUser, loginUser } from '../controllers/authController.js'

const router = express.Router()

// http://localhost:5000/api/auth/register
router.post('/register', registerUser)

// http://localhost:5000/api/auth/login
router.post('/login', loginUser)

export default router