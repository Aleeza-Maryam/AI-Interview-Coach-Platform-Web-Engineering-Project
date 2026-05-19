import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const Interview = () => {
  const [jobProfile, setJobProfile] = useState('Cybersecurity Analyst');
  const [difficulty, setDifficulty] = useState('Beginner');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Forcefully document level body tag ko black style inject karna jab component mount ho
  useEffect(() => {
    document.body.style.backgroundColor = '#0b0f19';
    return () => {
      document.body.style.backgroundColor = ''; // Cleanup on unmount
    };
  }, []);

  // Local storage parsing layers
  const userString = localStorage.getItem('user');
  const user = userString ? JSON.parse(userString) : { name: 'Irsa Maryam', email: 'irsa.dev.node@gmail.com' };

 const [questions, setQuestions] = useState([])

const handleStartSimulation = async () => {
  setLoading(true)
  const loadingToast = toast.loading('Connecting with Gemini AI Node... 🧠')

  try {
    const response = await fetch('http://localhost:5000/api/interview/generate-questions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ role: jobProfile, level: difficulty }),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || 'Server rejected session.')
    }

    toast.success('Questions received! 🚀', { id: loadingToast })

    // Questions ke saath Interview session page pe navigate karo
    navigate('/interview-session', {
      state: {
        questions: data.questions,
        role: jobProfile,
        level: difficulty
      }
    })

  } catch (err) {
    toast.error(`Error: ${err.message}`, { id: loadingToast })
  } finally {
    setLoading(false)
  }
}
  // HARD RESET LOGOUT FUNCTION
  const handleLogout = (e) => {
    e.preventDefault();
    console.log("De-authenticating credentials...");
    
    // 1. Storage wipe out
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.clear(); // Safe-guard flush

    toast.success('Session Terminated. Node De-authenticated! 🔐');

    // 2. Direct hard reload redirect to break browser layout memory
    window.location.href = '/login';
  };

  return (
    <div className="min-h-screen w-full bg-[#0b0f19] text-slate-100 font-sans p-8 overflow-x-hidden selection:bg-blue-500 selection:text-white">
      
      {/* TOP COMPONENT HEADER LAYER */}
      <div className="flex justify-between items-center mb-8 border-b border-slate-900 pb-4">
        <div className="text-[11px] font-mono tracking-widest text-slate-500 uppercase flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-blue-500 animate-pulse"></span>
          Nexus Core / Interview Engine
        </div>
        <button 
          type="button"
          onClick={handleLogout} 
          className="px-4 py-2 rounded-lg border border-red-500/30 text-red-400 text-xs font-bold bg-red-950/20 hover:bg-red-500/20 active:scale-95 transition-all duration-200 cursor-pointer block z-50 relative"
        >
          Disconnect Terminal (Logout)
        </button>
      </div>

      {/* CORE PROFILE MONITOR BOARD */}
      <div className="bg-slate-900/40 border border-slate-800/60 rounded-2xl p-6 mb-8 relative overflow-hidden transition-all duration-300 hover:border-slate-800 shadow-2xl">
        <div className="absolute top-0 right-0 p-4 bg-slate-950/40 border-l border-b border-slate-800 text-[10px] font-mono rounded-bl-xl text-slate-500">
          TIER: <span className="text-blue-400 font-bold">STANDARD</span>
        </div>
        <div className="text-[10px] font-mono text-blue-500 tracking-widest uppercase mb-1">Authorized Operating Node</div>
        <h1 className="text-3xl font-black text-white tracking-tight">{user.name}</h1>
        <div className="text-xs text-slate-500 font-mono mt-1">
          Node UID: <span className="text-slate-400">{user.email}</span>
        </div>
      </div>

      {/* LOWER GRID MODULE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT SELECTION COLUMN CONTROLLER */}
        <div className="lg:col-span-5 bg-slate-900/20 border border-slate-800/60 rounded-2xl p-6 space-y-6 flex flex-col justify-between shadow-lg">
          <div className="space-y-6">
            
            {/* INJECT DROP ELEMENT PROFILE */}
            <div className="space-y-2">
              <label className="block text-[11px] font-mono uppercase text-slate-400 tracking-wider">Select Target Job Profile</label>
              <select 
                value={jobProfile} 
                onChange={(e) => setJobProfile(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500/80 transition-all text-slate-300 cursor-pointer hover:border-slate-700"
              >
                <option value="Cybersecurity Analyst">Cybersecurity Analyst</option>
                <option value="Data Scientist">Data Scientist</option>
                <option value="Full Stack Developer">Full Stack Developer</option>
                <option value="Cloud Architect">Cloud Architect</option>
              </select>
            </div>

            {/* EXPERIENCE PILL SYSTEM SELECT */}
            <div className="space-y-2">
              <label className="block text-[11px] font-mono uppercase text-slate-400 tracking-wider">Experience Tier Matrix</label>
              <div className="grid grid-cols-3 gap-2">
                {['Beginner', 'Intermediate', 'Advanced'].map((level) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setDifficulty(level)}
                    className={`py-2.5 rounded-xl text-xs font-semibold border transition-all duration-200 active:scale-95 ${
                      difficulty === level 
                        ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-600/20' 
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* SIMULATION LAUNCH SUBMIT ACTION */}
          <div className="pt-4">
            <button 
              onClick={handleStartSimulation}
              disabled={loading}
              className={`w-full py-3.5 rounded-xl bg-blue-600 border border-blue-500 text-white font-bold text-sm tracking-wide hover:bg-blue-500 transition-all duration-300 flex items-center justify-center gap-2 active:scale-[0.99] shadow-md shadow-blue-600/10 ${
                loading ? 'opacity-50 cursor-not-allowed bg-slate-900 border-slate-800' : ''
              }`}
            >
              {loading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-slate-500 border-t-white rounded-full animate-spin"></div>
                  <span>Parsing Engine Nodes...</span>
                </div>
              ) : (
                <>Launch AI Interview Simulator 🚀</>
              )}
            </button>
          </div>
        </div>

        {/* RIGHT STREAM TELEMETRY LOADER LOGS */}
        <div className="lg:col-span-7 border border-dashed border-slate-800 rounded-2xl p-8 flex flex-col min-h-[360px] bg-slate-950/10">
          <div className="flex justify-between items-center border-b border-slate-800/60 pb-3 mb-6">
            <div className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">
              Live Session Telemetry Logs
            </div>
            <div className="flex items-center gap-1.5">
              <span className={`h-1.5 w-1.5 rounded-full ${loading ? 'bg-amber-500 animate-pulse' : 'bg-slate-700'}`}></span>
              <span className="text-[9px] font-mono text-slate-500 uppercase">{loading ? 'Processing' : 'System Ready'}</span>
            </div>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center text-center">
            {loading ? (
              <div className="space-y-4 animate-pulse">
                <div className="relative mx-auto w-12 h-12 flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full border border-blue-500/20 animate-ping"></div>
                  <div className="h-8 w-8 rounded-lg bg-blue-950/40 border border-blue-500/40 flex items-center justify-center text-blue-400 text-xs">
                    ⚙️
                  </div>
                </div>
                <div className="space-y-1">
                  <h4 className="text-xs font-semibold text-slate-300 font-mono tracking-wide">Syncing Remote Question Pipeline</h4>
                  <p className="text-slate-500 text-[11px] max-w-xs leading-relaxed">
                    Streaming configuration vector to generate <span className="text-blue-400">{jobProfile}</span> evaluation matrix...
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="text-slate-700 text-2xl">📊</div>
                <h5 className="text-xs font-semibold text-slate-400 uppercase tracking-wider font-mono">No Active Telemetry Stream</h5>
                <p className="text-slate-500 text-xs max-w-sm leading-relaxed mx-auto">
                  Configure the target parameters on the left dashboard module and launch the pipeline to stream metrics.
                </p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Interview;