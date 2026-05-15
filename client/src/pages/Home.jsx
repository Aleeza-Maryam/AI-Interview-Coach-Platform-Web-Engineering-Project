import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const roles = [
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Developer",
  "Data Analyst",
  "Data Scientist",
  "UI/UX Designer",
  "DevOps Engineer",
  "Machine Learning Engineer",
  "Mobile App Developer",
  "Cybersecurity Analyst"
]

const levels = ["Beginner", "Intermediate", "Advanced"]

function Home() {
  const [selectedRole, setSelectedRole] = useState('')
  const [selectedLevel, setSelectedLevel] = useState('')
  const navigate = useNavigate()

  const handleStart = () => {
    if (!selectedRole || !selectedLevel) {
      alert('Please select both role and experience level!')
      return
    }
    navigate('/interview', {
      state: { role: selectedRole, level: selectedLevel }
    })
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center px-4">
      <div className="bg-gray-800 rounded-2xl p-8 w-full max-w-lg shadow-xl">

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-blue-400 mb-2">
            AI Interview Coach
          </h1>
          <p className="text-gray-400">
            Practice interviews and get instant AI feedback
          </p>
        </div>

        {/* Role Selector */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Select Job Role
          </label>
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="w-full bg-gray-700 text-white rounded-lg px-4 py-3 
            focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">-- Choose a Role --</option>
            {roles.map((role) => (
              <option key={role} value={role}>{role}</option>
            ))}
          </select>
        </div>

        {/* Level Selector */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Select Experience Level
          </label>
          <div className="flex gap-3">
            {levels.map((level) => (
              <button
                key={level}
                onClick={() => setSelectedLevel(level)}
                className={`flex-1 py-3 rounded-lg font-medium transition-all duration-200
                  ${selectedLevel === level
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
              >
                {level}
              </button>
            ))}
          </div>
        </div>

        {/* Selected Info */}
        {selectedRole && selectedLevel && (
          <div className="bg-gray-700 rounded-lg p-4 mb-6 text-sm text-gray-300">
            Ready to practice as a{' '}
            <span className="text-blue-400 font-semibold">{selectedRole}</span>
            {' '}at{' '}
            <span className="text-green-400 font-semibold">{selectedLevel}</span>
            {' '}level
          </div>
        )}

        {/* Start Button */}
        <button
          onClick={handleStart}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold 
          py-4 rounded-lg text-lg transition-all duration-200 active:scale-95"
        >
          Start Interview 🚀
        </button>

      </div>
    </div>
  )
}

export default Home