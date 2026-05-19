import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '', email: '', password: '',
    jobProfile: '', experience: '', skills: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Registration failed');

      alert('Account setup complete! Please login to begin simulation. 🚀');
      navigate('/login');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-screen flex bg-[#0f172a] text-white font-sans overflow-x-hidden">
      
      {/* LEFT SIDE: Cinematic Visual Box (Uses 2.jfif) */}
      <div className="hidden lg:flex lg:w-1/2 relative items-center justify-center bg-slate-900">
        <img 
          src="/2.jfif" 
          alt="Signup Visual Concept" 
          className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-luminosity"
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-blue-950/80 via-transparent to-slate-950/90"></div>
        <div className="relative z-10 p-12 max-w-lg">
          <h2 className="text-4xl font-black tracking-tight text-white leading-tight">
            Tailor Your AI <br/><span className="text-blue-400">Interview Simulation</span>
          </h2>
          <p className="mt-4 text-slate-400 text-sm leading-relaxed">
            By analyzing your target job profile, domain skills, and technical career background, our model creates custom real-time interview pipelines.
          </p>
        </div>
      </div>

      {/* RIGHT SIDE: Interactive Scrollable Setup Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 overflow-y-auto max-h-screen">
        <div className="w-full max-w-md space-y-6">
          <div>
            <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
              Professional Setup
            </h2>
            <p className="text-slate-400 text-sm mt-1">Provide your target parameters for deep customization</p>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs text-center font-mono">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Core Row: Name & Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-400 mb-1.5">Full Name</label>
                <input type="text" name="name" required value={formData.name} onChange={handleChange} placeholder="Ali Khan" className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white focus:outline-none focus:border-blue-500 transition-all"/>
              </div>
              <div>
                <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-400 mb-1.5">Email Address</label>
                <input type="email" name="email" required value={formData.email} onChange={handleChange} placeholder="ali@domain.com" className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white focus:outline-none focus:border-blue-500 transition-all"/>
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-400 mb-1.5">Secure Password</label>
              <input type="password" name="password" required value={formData.password} onChange={handleChange} placeholder="••••••••" className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white focus:outline-none focus:border-blue-500 transition-all"/>
            </div>

            <div className="border-t border-slate-800/60 my-2 pt-2"></div>

            {/* Questionnaire: Target Profile */}
            <div>
              <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-400 mb-1.5">Target Job Profile</label>
              <input type="text" name="jobProfile" required value={formData.jobProfile} onChange={handleChange} placeholder="e.g., Software Engineer, Data Scientist" className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white focus:outline-none focus:border-blue-500 transition-all"/>
            </div>

            {/* Questionnaire: Experience Dropdown */}
            <div>
              <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-400 mb-1.5">Experience Tier</label>
              <select name="experience" required value={formData.experience} onChange={handleChange} className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white focus:outline-none focus:border-blue-500 transition-all cursor-pointer">
                <option value="" disabled>Select your seniority level</option>
                <option value="Fresher / Student">Fresher / Associate Student</option>
                <option value="Junior (1-2 Years)">Junior Developer (1-2 Years)</option>
                <option value="Mid-Level (3-5 Years)">Mid-Level Professional (3-5 Years)</option>
                <option value="Senior (5+ Years)">Senior Track Architect (5+ Years)</option>
              </select>
            </div>

            {/* Questionnaire: Technical Core Skills */}
            <div>
              <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-400 mb-1.5">Core Technical Skills (Comma Separated)</label>
              <input type="text" name="skills" required value={formData.skills} onChange={handleChange} placeholder="e.g., React, Python, MongoDB, AWS" className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white focus:outline-none focus:border-blue-500 transition-all"/>
            </div>

            <button type="submit" disabled={loading} className="w-full py-3 mt-4 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 text-white font-bold text-sm tracking-wide hover:from-blue-500 hover:to-blue-400 transition-all disabled:opacity-50 shadow-lg shadow-blue-500/10">
              {loading ? 'Processing System Config...' : 'Complete Profile Setup 🚀'}
            </button>
          </form>

          <p className="text-center text-xs text-slate-400">
            Existing credentials active?{' '}
            <Link to="/login" className="text-blue-400 hover:underline font-semibold">Sign In</Link>
          </p>
        </div>
      </div>

    </div>
  );
};

export default Signup;