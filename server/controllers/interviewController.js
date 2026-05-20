import InterviewReport from '../models/InterviewReport.js'

export const saveInterviewReport = async (req, res) => {
  const { userId, jobProfile, level, questionType, score, feedback, results } = req.body

  if (!userId || !jobProfile || !level || !questionType || score == null || !Array.isArray(results)) {
    return res.status(400).json({ error: 'Missing required report fields.' })
  }

  try {
    const report = await InterviewReport.create({
      userId,
      jobProfile,
      level,
      questionType,
      score,
      feedback,
      results
    })

    res.status(201).json({ message: 'Interview report saved successfully! ?', report })
  } catch (error) {
    console.error('Database schema operations error:', error.message)
    res.status(500).json({ error: error.message })
  }
}

export const getUserHistory = async (req, res) => {
  const { userId } = req.params

  if (!userId) {
    return res.status(400).json({ error: 'User ID is required to fetch history.' })
  }

  try {
    const history = await InterviewReport.find({ userId }).sort({ createdAt: -1 }).lean()
    res.json(history)
  } catch (error) {
    console.error('Fetch history error:', error.message)
    res.status(500).json({ error: error.message })
  }
}

export const getReportById = async (req, res) => {
  const { id } = req.params

  try {
    const report = await InterviewReport.findById(id).lean()
    if (!report) {
      return res.status(404).json({ error: 'Report not found.' })
    }
    res.json(report)
  } catch (error) {
    console.error('Fetch report error:', error.message)
    res.status(500).json({ error: error.message })
  }
}
