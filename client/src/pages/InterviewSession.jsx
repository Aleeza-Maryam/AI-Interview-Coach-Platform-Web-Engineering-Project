import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import axios from 'axios'

function InterviewSession() {
  const location = useLocation()
  const navigate = useNavigate()
  const { questions, role, level } = location.state || {}

  const [currentIndex, setCurrentIndex] = useState(0)
  const [answer, setAnswer] = useState('')
  const [evaluation, setEvaluation] = useState(null)
  const [allResults, setAllResults] = useState([])
  const [evaluating, setEvaluating] = useState(false)
  const [showFollowUp, setShowFollowUp] = useState(false)
  const [followUpAnswer, setFollowUpAnswer] = useState('')

  const handleSubmitAnswer = async () => {
    if (!answer.trim()) {
      alert('Please write an answer!')
      return
    }
    try {
      setEvaluating(true)
      const res = await axios.post('http://localhost:5000/api/interview/evaluate-answer', {
        question: questions[currentIndex],
        answer,
        role,
        level
      })
      setEvaluation(res.data)
      if (res.data.needsFollowUp) setShowFollowUp(true)
    } catch (err) {
      console.error('Evaluation Error:', err.response?.data || err.message)
      const errorMsg = err.response?.data?.error || err.message || 'Evaluation failed!'
      alert(`Evaluation failed: ${errorMsg}`)
    } finally {
      setEvaluating(false)
    }
  }

  const handleNext = () => {
    const result = {
      question: questions[currentIndex],
      answer,
      evaluation,
      followUpAnswer
    }
    const updatedResults = [...allResults, result]
    setAllResults(updatedResults)

    if (currentIndex + 1 >= questions.length) {
      navigate('/report', {
        state: { results: updatedResults, role, level }
      })
    } else {
      setCurrentIndex(currentIndex + 1)
      setAnswer('')
      setEvaluation(null)
      setShowFollowUp(false)
      setFollowUpAnswer('')
    }
  }

  if (!questions || questions.length === 0) {
    return (
      <div className="min-h-screen bg-[#0b0f19] text-white flex items-center justify-center">
        <p>No questions found. <a href="/" className="text-blue-400">Go back</a></p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0b0f19] text-white px-4 py-8">
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <div>
            <span className="text-blue-400 font-semibold">{role}</span>
            <span className="text-gray-400 mx-2">•</span>
            <span className="text-green-400 font-semibold">{level}</span>
          </div>
          <span className="text-gray-400 text-sm">
            {currentIndex + 1} / {questions.length}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-700 rounded-full h-2 mb-8">
          <div
            className="bg-blue-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
          />
        </div>

        {/* Question */}
        <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 mb-6">
          <p className="text-xs text-blue-400 font-mono mb-2">
            QUESTION {currentIndex + 1}
          </p>
          <p className="text-lg font-semibold leading-relaxed">
            {questions[currentIndex]}
          </p>
        </div>

        {/* Answer Input */}
        {!evaluation && (
          <div className="mb-6">
            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Type your answer here..."
              rows={6}
              className="w-full bg-slate-900 border border-slate-700 text-white 
              rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 resize-none"
            />
            <button
              onClick={handleSubmitAnswer}
              disabled={evaluating}
              className="mt-3 w-full bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700
              text-white font-bold py-3 rounded-xl transition-all duration-200"
            >
              {evaluating ? 'AI is Evaluating...' : 'Submit Answer ✅'}
            </button>
          </div>
        )}

        {/* Evaluation */}
        {evaluation && (
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 mb-6">
            <h3 className="text-lg font-bold text-blue-400 mb-4">AI Feedback</h3>

            {/* Scores */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              {[
                { label: 'Clarity', value: evaluation.clarity },
                { label: 'Depth', value: evaluation.depth },
                { label: 'Relevance', value: evaluation.relevance },
                { label: 'Overall', value: evaluation.overall },
              ].map((item) => (
                <div key={item.label} className="bg-slate-800 rounded-xl p-3 text-center">
                  <p className="text-gray-400 text-xs mb-1">{item.label}</p>
                  <p className={`text-2xl font-bold ${
                    item.value >= 7 ? 'text-green-400' :
                    item.value >= 5 ? 'text-yellow-400' : 'text-red-400'
                  }`}>
                    {item.value}/10
                  </p>
                </div>
              ))}
            </div>

            {/* Feedback */}
            <div className="space-y-3">
              <div className="bg-slate-800 rounded-xl p-3">
                <p className="text-xs text-gray-400 mb-1">💬 Feedback</p>
                <p className="text-sm text-gray-200">{evaluation.feedback}</p>
              </div>
              <div className="bg-green-950 border border-green-800 rounded-xl p-3">
                <p className="text-xs text-green-400 mb-1">✅ Strength</p>
                <p className="text-sm text-gray-200">{evaluation.strength}</p>
              </div>
              <div className="bg-red-950 border border-red-800 rounded-xl p-3">
                <p className="text-xs text-red-400 mb-1">⚠️ Improve</p>
                <p className="text-sm text-gray-200">{evaluation.improvement}</p>
              </div>
            </div>

            {/* Follow Up */}
            {showFollowUp && evaluation.followUpQuestion && (
              <div className="mt-4 bg-yellow-950 border border-yellow-800 rounded-xl p-4">
                <p className="text-xs text-yellow-400 mb-2">🔄 Follow-up Question</p>
                <p className="text-sm font-semibold mb-3">{evaluation.followUpQuestion}</p>
                <textarea
                  value={followUpAnswer}
                  onChange={(e) => setFollowUpAnswer(e.target.value)}
                  placeholder="Answer the follow-up..."
                  rows={3}
                  className="w-full bg-slate-900 text-white rounded-lg px-3 py-2
                  focus:outline-none focus:ring-2 focus:ring-yellow-500 resize-none text-sm"
                />
              </div>
            )}

            {/* Next Button */}
            <button
              onClick={handleNext}
              className="mt-4 w-full bg-green-600 hover:bg-green-500
              text-white font-bold py-3 rounded-xl transition-all duration-200"
            >
              {currentIndex + 1 >= questions.length
                ? 'View Final Report 📊'
                : 'Next Question →'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default InterviewSession