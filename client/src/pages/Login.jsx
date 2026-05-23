import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
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
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Invalid configuration');

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      // Modern premium toast notification layout replacing dirty alert popup
      toast.success('Authorization token generated. Access granted! 🔑', {
        duration: 3500,
        icon: '🔑',
      });

      // Navigate inside micro-task block to bypass sync token locks
      setTimeout(() => {
        navigate('/');
        window.location.reload();
      }, 800);

    } catch (err) {
      setError(err.message);
      toast.error(err.message || 'Authentication Node Failed!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-screen flex use-app-bg text-app font-sans overflow-hidden">
      
      {/* LEFT SIDE: Split Aesthetic Screen (Uses 1.jfif) */}
      <div className="hidden lg:flex lg:w-1/2 relative items-center justify-center use-card-bg">
        <img 
          src="/1.jfif" 
          alt="Login Workspace Visual" 
          className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-luminosity"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950/90 via-transparent to-blue-950/70"></div>
        <div className="relative z-10 p-12 max-w-lg">
          <h2 className="text-4xl font-black tracking-tight text-app leading-tight">
            Resume Your AI <br/>Training <span className="text-cyan-400">Sessions</span>
          </h2>
          <p className="mt-4 text-muted text-sm leading-relaxed">
            Log back into your core environment variables to retrieve prior interview logs, metric score boards, and system evaluations.
          </p>
        </div>
      </div>

      {/* RIGHT SIDE: Dedicated Portal Input Box */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12">
        <div className="w-full max-w-sm space-y-6">
          <div>
            <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
              System Access
            </h2>
            <p className="text-muted text-sm mt-1">Authenticate identity nodes to initialize user dashboard</p>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs text-center font-mono">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[10px] font-mono uppercase tracking-wider text-muted mb-1.5">Email Port</label>
              <input type="email" name="email" required value={formData.email} onChange={handleChange} placeholder="you@example.com" className="w-full px-4 py-3 rounded-xl use-card-bg border border-accent text-sm text-app focus:outline-none focus:border-blue-500 transition-all"/>
            </div>

            <div>
              <label className="block text-[10px] font-mono uppercase tracking-wider text-muted mb-1.5">Access Password</label>
              <input type="password" name="password" required value={formData.password} onChange={handleChange} placeholder="••••••••" className="w-full px-4 py-3 rounded-xl use-card-bg border border-accent text-sm text-app focus:outline-none focus:border-blue-500 transition-all"/>
            </div>

            <button type="submit" disabled={loading} className="w-full py-3 mt-4 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 text-app font-bold text-sm tracking-wide hover:from-blue-500 hover:to-blue-400 transition-all disabled:opacity-50 shadow-lg shadow-blue-500/10">
              {loading ? 'Verifying Tokens...' : 'Sign In 🔑'}
            </button>
          </form>

          <p className="text-center text-xs text-muted">
            New node cluster requirement?{' '}
            <Link to="/signup" className="text-blue-400 hover:underline font-semibold">Setup Profile</Link>
          </p>
        </div>
      </div>

    </div>
  );
};

export default Login;