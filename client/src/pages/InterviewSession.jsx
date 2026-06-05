import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import axios from 'axios'

function InterviewSession() {
  const location = useLocation()
  const navigate = useNavigate()
  const { role, level } = location.state || {}

  // Configuration State
  const [numQuestions, setNumQuestions] = useState(10)
  const [questionType, setQuestionType] = useState('Both')
  const [generating, setGenerating] = useState(false)

  // Interview State
  const [questions, setQuestions] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answer, setAnswer] = useState('')
  const [listening, setListening] = useState(false)
  const [recognition, setRecognition] = useState(null)
  const [listeningTarget, setListeningTarget] = useState(null)
  const [evaluation, setEvaluation] = useState(null)
  const [allResults, setAllResults] = useState([])
  const [evaluating, setEvaluating] = useState(false)
  const [showFollowUp, setShowFollowUp] = useState(false)
  const [followUpAnswer, setFollowUpAnswer] = useState('')
  const [recognitionFollow, setRecognitionFollow] = useState(null)

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      try { if (recognition) recognition.stop() } catch (e) {}
      try { if (recognitionFollow) recognitionFollow.stop() } catch (e) {}
    }
  }, [recognition, recognitionFollow])

  // Ensure microphone permission before starting SpeechRecognition
  const ensureMicPermission = async () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) return true
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      // stop tracks immediately - we only wanted the permission
      stream.getTracks().forEach((t) => t.stop())
      return true
    } catch (err) {
      console.error('Microphone permission denied or not available', err)
      return false
    }
  }

  const toggleSpeechInput = async (target, updateText) => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser.')
      return
    }

    const ok = await ensureMicPermission()
    if (!ok) {
      alert('Microphone access is required. Please allow microphone permission in your browser.')
      return
    }

    if (listeningTarget === target && recognition) {
      recognition.stop()
      setListeningTarget(null)
      setRecognition(null)
      return
    }

    if (recognition) recognition.stop()

    const rec = new SpeechRecognition()
    rec.continuous = true
    rec.interimResults = true
    rec.lang = 'en-US'

    rec.onresult = (event) => {
      let interim = ''
      let final = ''
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        const transcript = event.results[i][0].transcript
        if (event.results[i].isFinal) final += transcript
        else interim += transcript
      }
      if (final) {
        // normalize some common speech-to-text mistakes for SQL-like phrases
        final = final.replace(/\b(static|star|asterisk)\b/gi, '*')
        updateText((prev) => (prev + ' ' + final).trim())
      } else {
        // ignore interim for persistent state to avoid duplicates
        console.debug('Interim transcript (not appended):', interim)
      }
    }

    rec.onend = () => {
      console.debug('SpeechRecognition ended')
      // Try to auto-restart if we intend to keep listening (handles short browser timeouts)
      if (listeningTarget === target) {
        setTimeout(() => {
          try {
            rec.start()
            console.debug('SpeechRecognition restarted')
          } catch (e) {
            console.error('Could not restart recognition', e)
            setListeningTarget(null)
            setRecognition(null)
          }
        }, 250)
      } else {
        setListeningTarget(null)
        setRecognition(null)
      }
    }

    rec.onerror = (e) => {
      console.error('Speech recognition error', e.error || e)
      // Some transient errors (no-speech, network) can be recovered by restarting
      const recoverable = ['no-speech', 'network', 'aborted', 'audio-capture'].includes(e.error)
      if (recoverable && listeningTarget === target) {
        setTimeout(() => {
          try { rec.start(); console.debug('SpeechRecognition restarted after error') } catch (err) { console.error('Restart after error failed', err); setListeningTarget(null); setRecognition(null) }
        }, 300)
      } else {
        setListeningTarget(null)
        setRecognition(null)
      }
    }

    setRecognition(rec)
    setListeningTarget(target)
    try { rec.start(); console.log('Speech recognition started') } catch (err) {
      console.error('Speech start error', err)
      alert('Could not start speech recognition.')
      setListeningTarget(null)
      setRecognition(null)
    }
  }

  const handleMainMic = async () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) {
      alert('Speech recognition not supported in this browser.')
      return
    }

    if (listening && recognition) {
      recognition.stop()
      setListening(false)
      return
    }

    const rec = new SpeechRecognition()
    rec.continuous = true
    rec.interimResults = true
    rec.lang = 'en-US'

    rec.onresult = (event) => {
      let interim = ''
      let final = ''
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        const transcript = event.results[i][0].transcript
        if (event.results[i].isFinal) final += transcript
        else interim += transcript
      }
      if (final) {
        final = final.replace(/\b(static|star|asterisk)\b/gi, '*')
        setAnswer((prev) => (prev + ' ' + final).trim())
      } else {
        console.debug('Interim transcript (not appended):', interim)
      }
    }

    rec.onend = () => {
      console.debug('Main SpeechRecognition ended')
      if (listening) {
        // small delay before restarting to avoid rapid loops
        setTimeout(() => {
          try { rec.start(); console.debug('Main SpeechRecognition restarted') } catch (e) { console.error('Could not restart recognition', e); setListening(false) }
        }, 250)
      } else {
        setListening(false)
      }
    }

    rec.onerror = (e) => { console.error('Speech recognition error', e.error || e); setListening(false) }

    setRecognition(rec)
    const ok = await ensureMicPermission()
    if (!ok) {
      alert('Microphone access is required. Please allow microphone permission in your browser.')
      setRecognition(null)
      return
    }
    try {
      rec.start()
      setListening(true)
    } catch (err) {
      console.error('Speech start error', err)
      alert('Could not start speech recognition.')
    }
  }

  const handleGenerateQuestions = async () => {
    setGenerating(true)
    try {
      const res = await axios.post('http://localhost:5000/api/interview/generate-questions', {
        role,
        level,
        numQuestions: parseInt(numQuestions),
        questionType
      })
      setQuestions(res.data.questions)
    } catch (err) {
      alert(`Failed to generate questions: ${err.response?.data?.error || err.message}`)
    } finally {
      setGenerating(false)
    }
  }

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
      alert(`Evaluation failed: ${err.response?.data?.error || err.message}`)
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
        state: { results: updatedResults, role, level, questionType }
      })
    } else {
      setCurrentIndex(currentIndex + 1)
      setAnswer('')
      setEvaluation(null)
      setShowFollowUp(false)
      setFollowUpAnswer('')
      setListening(false)
    }
  }

  // If role/level not provided
  if (!role || !level) {
    return (
      <div className="min-h-screen use-app-bg text-app flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400 mb-4">No interview configuration found.</p>
          <a href="/" className="text-blue-400 hover:underline">Go back to home</a>
        </div>
      </div>
    )
  }

  // Configuration Screen
  if (questions.length === 0 && !generating) {
    return (
      <div className="min-h-screen use-app-bg text-app px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-2">
              Interview Configuration
            </h1>
            <p className="text-muted">Customize your interview experience</p>
          </div>

          {/* Role & Level */}
          <div className="use-card-bg border border-accent rounded-2xl p-6 mb-6">
            <h2 className="text-sm font-mono text-blue-400 mb-4">CONFIRMED DETAILS</h2>
            <div className="flex gap-6">
              <div className="flex-1 use-card-bg rounded-xl p-4 text-center">
                <p className="text-xs text-muted mb-1">Job Role</p>
                <p className="text-lg font-bold text-blue-400">{role}</p>
              </div>
              <div className="flex-1 use-card-bg rounded-xl p-4 text-center">
                <p className="text-xs text-muted mb-1">Experience Level</p>
                <p className="text-lg font-bold text-green-400">{level}</p>
              </div>
            </div>
          </div>

          {/* Number of Questions */}
          <div className="use-card-bg border border-accent rounded-2xl p-6 mb-6">
            <label className="block text-sm font-mono text-blue-400 mb-3">NUMBER OF QUESTIONS</label>
            <div className="grid grid-cols-3 gap-3">
              {[5, 10, 15].map((num) => (
                <button
                  key={num}
                  onClick={() => setNumQuestions(num)}
                  className={`py-3 rounded-xl font-semibold transition-all duration-200 ${
                    numQuestions === num
                      ? 'bg-blue-600 text-app shadow-lg shadow-blue-600/30'
                      : 'use-card-bg text-muted hover:opacity-90'
                  }`}
                >
                  {num} Questions
                </button>
              ))}
            </div>
          </div>

          {/* Question Type */}
          <div className="use-card-bg border border-accent rounded-2xl p-6 mb-8">
            <label className="block text-sm font-mono text-blue-400 mb-3">QUESTION TYPE</label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { value: 'Technical', label: 'Technical', desc: 'Coding, algorithms, tech stack' },
                { value: 'Behavioral', label: 'Behavioral', desc: 'Situational, soft skills' },
                { value: 'Both', label: 'Mixed', desc: 'Technical + Behavioral' }
              ].map((type) => (
                <button
                  key={type.value}
                  onClick={() => setQuestionType(type.value)}
                  className={`py-3 px-2 rounded-xl font-semibold transition-all duration-200 ${
                    questionType === type.value
                      ? 'bg-blue-600 text-app shadow-lg shadow-blue-600/30'
                      : 'use-card-bg text-muted hover:opacity-90'
                  }`}
                >
                  <div className="text-sm">{type.label}</div>
                  <div className="text-[10px] opacity-70 mt-1">{type.desc}</div>
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleGenerateQuestions}
            className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500
            text-app font-bold py-4 rounded-xl transition-all duration-200 text-lg"
          >
            Generate Questions
          </button>

          <div className="text-center mt-6">
            <a href="/" className="text-gray-500 text-sm hover:text-gray-400">
              Change role or level
            </a>
          </div>
        </div>
      </div>
    )
  }

  // Loading Screen
  if (generating) {
    return (
      <div className="min-h-screen use-app-bg text-app flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-16 h-16 mx-auto mb-4">
            <div className="absolute inset-0 border-4 border-blue-500/30 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <h2 className="text-xl font-semibold mb-2">Generating Questions</h2>
          <p className="text-gray-400 text-sm">
            AI is preparing {numQuestions} {questionType.toLowerCase()} questions for {role}...
          </p>
        </div>
      </div>
    )
  }

  // Interview Session Screen
  return (
    <div className="min-h-screen use-app-bg text-app px-4 py-8">
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-blue-400 font-semibold">{role}</span>
            <span className="text-gray-400">•</span>
            <span className="text-green-400 font-semibold">{level}</span>
            <span className="text-gray-400">•</span>
            <span className="text-cyan-400 font-semibold text-sm">{questionType}</span>
          </div>
          <span className="text-gray-400 text-sm flex-shrink-0">
            {currentIndex + 1} / {questions.length}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full rounded-full h-2 mb-8 use-card-bg" style={{ backgroundColor: 'rgba(100,116,139,0.14)' }}>
          <div
            className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
          />
        </div>

        {/* Question Card */}
        <div className="use-card-bg border border-accent rounded-2xl p-6 mb-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs text-blue-400 font-mono bg-blue-500/10 px-2 py-1 rounded">
              QUESTION {currentIndex + 1}
            </span>
          </div>
          <p className="text-lg font-semibold leading-relaxed">
            {questions[currentIndex]}
          </p>
        </div>

        {/* Answer Input */}
        {!evaluation && (
          <div className="mb-6">
            <div className="relative">
              <textarea
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Type your answer here..."
                rows={6}
                className="w-full use-card-bg border border-accent text-app
                rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none"
              />
              <button
                onClick={handleMainMic}
                className={`absolute right-3 bottom-3 w-9 h-9 rounded-full flex items-center justify-center text-app shadow-lg transition-all ${
                  listening ? 'bg-red-600' : 'bg-blue-600 hover:bg-blue-500'
                }`}
                title={listening ? 'Stop recording' : 'Start voice input'}
              >
                {listening ? (
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
                    <rect x="2" y="2" width="10" height="10" rx="2"/>
                  </svg>
                ) : (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 1a4 4 0 0 1 4 4v7a4 4 0 0 1-8 0V5a4 4 0 0 1 4-4zm7 11a7 7 0 0 1-14 0H3a9 9 0 0 0 8 8.94V23h2v-2.06A9 9 0 0 0 21 12h-2z"/>
                  </svg>
                )}
              </button>
            </div>
            {listening && (
              <p className="text-xs text-red-400 mt-2 flex items-center gap-1">
                <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse inline-block"></span>
                Listening... speak now
              </p>
            )}
            <button
              onClick={handleSubmitAnswer}
              disabled={evaluating}
              className="mt-3 w-full bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700
              text-app font-bold py-3 rounded-xl transition-all duration-200"
            >
              {evaluating ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  AI is Evaluating...
                </span>
              ) : 'Submit Answer'}
            </button>
          </div>
        )}

        {/* Evaluation Feedback */}
        {evaluation && (
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 mb-6">
            <h3 className="text-lg font-bold text-blue-400 mb-4">AI Feedback</h3>

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

            <div className="space-y-3">
              <div className="bg-slate-800 rounded-xl p-3">
                <p className="text-xs text-gray-400 mb-1">Feedback</p>
                <p className="text-sm text-gray-200">{evaluation.feedback}</p>
              </div>
              <div className="bg-green-950/50 border border-green-800 rounded-xl p-3">
                <p className="text-xs text-green-400 mb-1">Strength</p>
                <p className="text-sm text-gray-200">{evaluation.strength}</p>
              </div>
              <div className="bg-red-950/50 border border-red-800 rounded-xl p-3">
                <p className="text-xs text-red-400 mb-1">Improvement</p>
                <p className="text-sm text-gray-200">{evaluation.improvement}</p>
              </div>
            </div>

            {/* Follow-up Question */}
            {showFollowUp && evaluation.followUpQuestion && (
              <div className="mt-4 bg-yellow-950/50 border border-yellow-800 rounded-xl p-4">
                <p className="text-xs text-yellow-400 mb-2">Follow-up Question</p>
                <p className="text-sm font-semibold mb-3">{evaluation.followUpQuestion}</p>
                <div className="relative">
                  <textarea
                    value={followUpAnswer}
                    onChange={(e) => setFollowUpAnswer(e.target.value)}
                    placeholder="Answer the follow-up..."
                    rows={3}
                    className="w-full bg-slate-900 text-app rounded-lg px-3 py-2
                    focus:outline-none focus:ring-2 focus:ring-yellow-500 resize-none text-sm"
                  />
                  <button
                    onClick={() => toggleSpeechInput('followUp', setFollowUpAnswer)}
                    className={`absolute right-2 bottom-2 w-8 h-8 rounded-full flex items-center justify-center text-app ${
                      listeningTarget === 'followUp' ? 'bg-red-600' : 'bg-yellow-600 hover:bg-yellow-500'
                    }`}
                  >
                    {listeningTarget === 'followUp' ? (
                      <svg width="12" height="12" viewBox="0 0 14 14" fill="currentColor">
                        <rect x="2" y="2" width="10" height="10" rx="2"/>
                      </svg>
                    ) : (
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 1a4 4 0 0 1 4 4v7a4 4 0 0 1-8 0V5a4 4 0 0 1 4-4zm7 11a7 7 0 0 1-14 0H3a9 9 0 0 0 8 8.94V23h2v-2.06A9 9 0 0 0 21 12h-2z"/>
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            )}

            <button
              onClick={handleNext}
              className="mt-4 w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500
              text-app font-bold py-3 rounded-xl transition-all duration-200"
            >
              {currentIndex + 1 >= questions.length ? 'View Final Report' : 'Next Question'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default InterviewSession