import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'

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
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)
  
  // Selection States for new interview
  const [selectedRole, setSelectedRole] = useState('')
  const [selectedLevel, setSelectedLevel] = useState('')

  useEffect(() => {
    // 1. Check logged in session credentials
    const loggedInUser = localStorage.getItem('user')
    if (!loggedInUser) {
      navigate('/login')
      return;
    }
    const parsedUser = JSON.parse(loggedInUser)
    setUser(parsedUser)

    // 2. Fetch specific user distinct logs matrix
    fetch(`http://localhost:5000/api/dashboard/user-history/${parsedUser.id}`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setHistory(data)
        }
        setLoading(false)
      })
      .catch((err) => {
        console.error("Dashboard metric cluster error:", err)
        setLoading(false)
      })
  }, [navigate])

  const handleStart = () => {
    if (!selectedRole || !selectedLevel) {
      alert('Please select both role and experience level!')
      return
    }
    navigate('/interview', {
      state: { role: selectedRole, level: selectedLevel }
    })
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
    window.location.reload()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f172a] text-blue-400 flex items-center justify-center font-mono tracking-widest animate-pulse">
        SYNCING DASHBOARD METRICS...
      </div>
    )
  }

  return (
    <div className="min-h-screen w-screen bg-[#0f172a] text-white font-sans overflow-x-hidden">
      
      {/* Top Professional Portal Control Bar */}
      <nav className="border-b border-slate-800 bg-[#1e293b]/50 backdrop-blur px-6 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <div className="h-2.5 w-2.5 rounded-full bg-blue-500 animate-ping"></div>
          <span className="font-mono text-xs tracking-widest text-slate-400">SECURE PROFILE PORTAL</span>
        </div>
        <button 
          onClick={handleLogout} 
          className="px-4 py-1.5 rounded-xl border border-red-500/30 text-red-400 text-xs font-mono tracking-wide hover:bg-red-500/10 transition-all"
        >
          Disconnect Terminal (Logout)
        </button>
      </nav>

      {/* Primary Dashboard Panel Workspace */}
      <div className="max-w-6xl mx-auto p-4 sm:p-8 space-y-8">
        
        {/* User Identity Welcome Module Banner */}
        <div className="p-6 sm:p-8 rounded-2xl bg-[#1e293b] border border-slate-800/80 shadow-xl flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <span className="text-xs font-mono text-blue-400 uppercase tracking-wider block">Authorized Operating Node</span>
            <h1 className="text-3xl font-black tracking-tight text-white mt-1">{user?.name}</h1>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-400 mt-2 font-mono">
              <p>ID Account: <span className="text-slate-300">{user?.email}</span></p>
              <p className="hidden sm:inline">|</p>
              <p>Target Track: <span className="text-blue-400 font-sans">{user?.jobProfile || 'Not Configured'}</span></p>
            </div>
          </div>
          
          <div className="text-xs font-mono bg-slate-900/60 p-3 rounded-xl border border-slate-800 h-fit shrink-0">
            <span className="text-slate-500 block">ACCOUNT CAPABILITIES:</span>
            <span className="text-emerald-400 font-bold">{user?.experience || 'Standard Track'}</span>
          </div>
        </div>

        {/* Dashboard Dynamic Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT COLUMN: Launch New Session (Your selectors inside Dashboard) */}
          <div className="bg-[#1e293b] border border-slate-800 rounded-2xl p-6 h-fit space-y-5 shadow-lg">
            <div>
              <h2 className="text-lg font-bold text-white">Initialize Simulation</h2>
              <p className="text-xs text-slate-400 mt-1">Configure parameters to start target practice sessions.</p>
            </div>

            {/* Role dropdown */}
            <div>
              <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-400 mb-1.5">Select Target Job Role</label>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="w-full bg-slate-900 text-white rounded-xl border border-slate-800 px-4 py-3 text-sm focus:outline-none focus:border-blue-500 transition-all cursor-pointer"
              >
                <option value="">-- Choose a Role --</option>
                {roles.map((role) => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>
            </div>

            {/* Level Selector buttons */}
            <div>
              <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-400 mb-1.5">Select Experience Difficulty</label>
              <div className="flex gap-2">
                {levels.map((level) => (
                  <button
                    key={level}
                    onClick={() => setSelectedLevel(level)}
                    className={`flex-1 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all duration-150
                      ${selectedLevel === level
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-600/10'
                        : 'bg-slate-900 text-slate-400 border border-slate-800 hover:bg-slate-800/50'
                      }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

            {/* Direct Trigger Execution Button */}
            <button
              onClick={handleStart}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-bold text-sm tracking-wide shadow-lg shadow-blue-500/10 transition-all active:scale-[0.98]"
            >
              Start Interview Simulation 🚀
            </button>
          </div>

          {/* RIGHT COLUMN: Separate Complete Practices Log Session Tracking */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400">Separate Session Logs & Evaluations</h3>
            
            {history.length === 0 ? (
              <div className="p-12 text-center border-2 border-dashed border-slate-800/60 rounded-2xl text-slate-500 text-sm bg-slate-900/10">
                No archived interface data assets. Run your first simulation parameter configuration node on the left panel to record telemetry.
              </div>
            ) : (
              <div className="space-y-3.5">
                {history.map((session) => (
                  <div 
                    key={session._id} 
                    className="p-5 rounded-2xl bg-[#1e293b] border border-slate-800/80 hover:border-slate-700 transition-all duration-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-sm"
                  >
                    <div className="space-y-1">
                      <span className="text-[10px] font-mono text-slate-500 block">{new Date(session.createdAt).toLocaleDateString()} - SECURITY EVAL</span>
                      <h4 className="text-base font-bold text-slate-100">{session.jobProfile} Session</h4>
                      <p className="text-slate-400 text-xs line-clamp-1 pr-4">{session.feedback}</p>
                    </div>
                    
                    <div className="flex items-center space-x-3 w-full sm:w-auto justify-between sm:justify-end shrink-0 border-t border-slate-800 sm:border-0 pt-3 sm:pt-0">
                      <div className="px-3 py-1.5 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 font-mono font-black text-xs tracking-wider">
                        SCORE: {session.score}%
                      </div>
                      <Link 
                        to={`/report?id=${session._id}`} 
                        className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-blue-400 hover:text-white font-semibold hover:bg-slate-800 transition-all"
                      >
                        View Report 📋
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  )
}

export default Home