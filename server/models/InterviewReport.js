import mongoose from 'mongoose'

const interviewReportSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  jobProfile: { type: String, required: true },
  level: { type: String, required: true },
  questionType: { type: String, required: true },
  score: { type: Number, required: true },
  feedback: { type: String, required: true },
  results: [
    {
      question: { type: String, required: true },
      answer: { type: String, default: '' },
      followUpAnswer: { type: String, default: '' },
      evaluation: { type: mongoose.Schema.Types.Mixed, default: {} }
    }
  ],
  createdAt: { type: Date, default: Date.now }
})

export default mongoose.model('InterviewReport', interviewReportSchema)
