import User from '../models/User.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

// ==========================================
// 1. SIGNUP (User Register Karna - WITH JOB QUESTIONNAIRE)
// ==========================================
export const registerUser = async (req, res) => {
  // Destructure name, email, password aur saare naye questionnaire fields
  const { name, email, password, jobProfile, experience, skills } = req.body

  try {
    // Check karna ke email pehle se register to nahi hai
    const userExists = await User.findOne({ email })
    if (userExists) {
      return res.status(400).json({ error: 'Email already registered' })
    }

    // Password ko secure (hash) karna
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    // Naya user saare advanced parameters ke sath database mein save karna
    await User.create({
      name,
      email,
      password: hashedPassword,
      jobProfile,
      experience,
      skills
    })

    res.status(201).json({ message: 'User registered successfully! ✅' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// ==========================================
// 2. LOGIN (User Authenticate Karna)
// ==========================================
export const loginUser = async (req, res) => {
  const { email, password } = req.body

  try {
    // Email check karna ke exist karti hai ya nahi
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(400).json({ error: 'Invalid Email or Password' })
    }

    // Password match karke dekhna
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid Email or Password' })
    }

    // JWT Token generate karna (Secret key abhi 'mysecret' rakh rahe hain)
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'mysecret', { expiresIn: '7d' })

    // User ka data aur token wapis bhejna
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        jobProfile: user.jobProfile, // Return extra fields if needed on dashboard
        experience: user.experience,
        skills: user.skills
      }
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}