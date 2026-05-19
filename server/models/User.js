import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  
  // Naye Questionnaire Fields
  jobProfile: { type: String, required: true },   // e.g., MERN Stack Developer, Data Analyst
  experience: { type: String, required: true },   // e.g., Fresher, 1-2 Years, 3+ Years
  skills: { type: String, required: true },       // e.g., React, Node, Python, SQL
  
  createdAt: { type: Date, default: Date.now }
})

export default mongoose.model('User', userSchema)