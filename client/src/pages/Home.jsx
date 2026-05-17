import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Briefcase, ChevronRight, Sparkles, Award, Target, Shield, Code, PenTool, Database, Cpu, Layout, Cloud, Smartphone, BarChart, Binary } from 'lucide-react';

const roles = [
  { name: "Frontend Developer", icon: Layout, color: "from-cyan-500 to-blue-500" },
  { name: "Backend Developer", icon: Database, color: "from-emerald-500 to-teal-500" },
  { name: "Full Stack Developer", icon: Code, color: "from-purple-500 to-indigo-500" },
  { name: "Data Analyst", icon: BarChart, color: "from-orange-500 to-red-500" },
  { name: "Data Scientist", icon: Binary, color: "from-pink-500 to-rose-500" },
  { name: "UI/UX Designer", icon: PenTool, color: "from-violet-500 to-purple-500" },
  { name: "DevOps Engineer", icon: Cloud, color: "from-sky-500 to-blue-500" },
  { name: "Machine Learning Engineer", icon: Cpu, color: "from-indigo-500 to-purple-500" },
  { name: "Mobile App Developer", icon: Smartphone, color: "from-green-500 to-emerald-500" },
  { name: "Cybersecurity Analyst", icon: Shield, color: "from-red-500 to-orange-500" }
];

const levels = [
  { name: "Beginner", icon: Target, description: "Learning fundamentals", gradient: "from-green-500/20 to-emerald-500/20", border: "hover:border-green-500/50" },
  { name: "Intermediate", icon: Award, description: "Building projects", gradient: "from-blue-500/20 to-cyan-500/20", border: "hover:border-blue-500/50" },
  { name: "Advanced", icon: Sparkles, description: "Expert level", gradient: "from-purple-500/20 to-pink-500/20", border: "hover:border-purple-500/50" }
];

function Home() {
  const [selectedRole, setSelectedRole] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('');
  const [isHovering, setIsHovering] = useState(false);
  const navigate = useNavigate();

  const selectedRoleData = roles.find(r => r.name === selectedRole);
  const selectedLevelData = levels.find(l => l.name === selectedLevel);

  const handleStart = () => {
    if (!selectedRole || !selectedLevel) {
      alert('Please select both role and experience level!');
      return;
    }
    navigate('/interview', {
      state: { role: selectedRole, level: selectedLevel }
    });
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-gray-900 via-gray-900 to-black">
      {/* Animated Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1516116216624-53e697fedbea?q=80&w=2128&auto=format&fit=crop')`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900/90 via-gray-900/80 to-black/90" />
        
        {/* Animated Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.05)_1px,transparent_1px),linear-gradient(to_right,rgba(59,130,246,0.05)_1px,transparent_1px)] bg-[size:40px_40px]" />
        
        {/* Animated Gradient Orbs */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse animation-delay-2000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-5 animate-pulse animation-delay-4000" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-5xl">
          {/* Header Section with Glassmorphism */}
          <div className="text-center mb-12 animate-fade-in">
            <div className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-lg rounded-full px-4 py-2 mb-6 border border-white/10">
              <Sparkles className="w-4 h-4 text-yellow-400" />
              <span className="text-sm text-gray-300">AI-Powered Interview Coach</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent animate-gradient">
              Master Your Interview
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Practice with AI, get real-time feedback, and ace your next interview with confidence
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Role Selection */}
            <div className="space-y-4 animate-slide-up">
              <div className="flex items-center gap-2 mb-4">
                <Briefcase className="w-5 h-5 text-blue-400" />
                <label className="text-lg font-semibold text-white">Select Your Role</label>
              </div>
              <div className="grid gap-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {roles.map((role, index) => {
                  const Icon = role.icon;
                  const isSelected = selectedRole === role.name;
                  return (
                    <button
                      key={role.name}
                      onClick={() => setSelectedRole(role.name)}
                      className={`group relative flex items-center gap-4 p-4 rounded-xl transition-all duration-300 text-left
                        ${isSelected 
                          ? `bg-gradient-to-r ${role.color} shadow-lg shadow-blue-500/20 scale-[1.02]` 
                          : 'bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20'
                        } backdrop-blur-sm`}
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <div className={`p-2 rounded-lg transition-all duration-300 ${isSelected ? 'bg-white/20' : 'bg-white/10 group-hover:bg-white/20'}`}>
                        <Icon className={`w-5 h-5 transition-all ${isSelected ? 'text-white' : 'text-gray-400 group-hover:text-white'}`} />
                      </div>
                      <div className="flex-1">
                        <div className={`font-medium transition-all ${isSelected ? 'text-white' : 'text-gray-300 group-hover:text-white'}`}>
                          {role.name}
                        </div>
                      </div>
                      {isSelected && (
                        <div className="absolute right-4">
                          <div className="w-2 h-2 bg-white rounded-full animate-ping" />
                          <div className="w-2 h-2 bg-white rounded-full absolute top-0" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right Column - Level Selection & Preview */}
            <div className="space-y-6 animate-slide-up animation-delay-200">
              {/* Level Selection */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Award className="w-5 h-5 text-purple-400" />
                  <label className="text-lg font-semibold text-white">Experience Level</label>
                </div>
                <div className="grid gap-4">
                  {levels.map((level, index) => {
                    const Icon = level.icon;
                    const isSelected = selectedLevel === level.name;
                    return (
                      <button
                        key={level.name}
                        onClick={() => setSelectedLevel(level.name)}
                        className={`group relative p-4 rounded-xl transition-all duration-300 text-left backdrop-blur-sm
                          ${isSelected 
                            ? `bg-gradient-to-r ${level.gradient} border border-white/20 shadow-lg` 
                            : 'bg-white/5 hover:bg-white/10 border border-white/10'
                          } ${level.border}`}
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <div className="flex items-center gap-4">
                          <div className={`p-2 rounded-lg transition-all ${isSelected ? 'bg-white/20' : 'bg-white/10'}`}>
                            <Icon className={`w-5 h-5 ${isSelected ? 'text-white' : 'text-gray-400'}`} />
                          </div>
                          <div className="flex-1">
                            <div className={`font-medium ${isSelected ? 'text-white' : 'text-gray-300'}`}>
                              {level.name}
                            </div>
                            <div className="text-sm text-gray-500">{level.description}</div>
                          </div>
                          {isSelected && (
                            <ChevronRight className="w-5 h-5 text-white" />
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Preview Card */}
              {(selectedRole && selectedLevel) && selectedRoleData && selectedLevelData && (
                <div className="mt-6 p-6 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg border border-white/20 animate-fade-in">
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`p-2 rounded-lg bg-gradient-to-r ${selectedRoleData.color}`}>
                      <selectedRoleData.icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">Ready to Begin</h3>
                      <p className="text-sm text-gray-400">Your personalized interview session</p>
                    </div>
                  </div>
                  <div className="space-y-2 mb-6">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-400">Role</span>
                      <span className="text-white font-medium">{selectedRole}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-400">Level</span>
                      <span className="text-white font-medium">{selectedLevel}</span>
                    </div>
                  </div>
                  <button
                    onClick={handleStart}
                    onMouseEnter={() => setIsHovering(true)}
                    onMouseLeave={() => setIsHovering(false)}
                    className="relative w-full group overflow-hidden rounded-xl bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-500 bg-[length:200%_100%] hover:bg-right transition-all duration-500"
                  >
                    <div className="relative px-6 py-4 flex items-center justify-center gap-2">
                      <span className="font-semibold text-white">Start Interview</span>
                      <ChevronRight className={`w-5 h-5 text-white transition-transform duration-300 ${isHovering ? 'translate-x-1' : ''}`} />
                    </div>
                  </button>
                </div>
              )}

              {/* Features List */}
              <div className="mt-6 p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
                <div className="grid grid-cols-2 gap-3">
                  {[
                    "AI-Powered Feedback",
                    "Real-time Analysis",
                    "Behavioral Questions",
                    "Technical Assessment"
                  ].map((feature, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-gray-400">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
        }
        .animate-slide-up {
          animation: slide-up 0.6s ease-out forwards;
          opacity: 0;
        }
        .animate-gradient {
          background-size: 200% auto;
          animation: gradient 3s linear infinite;
        }
        .animation-delay-200 {
          animation-delay: 200ms;
        }
        .animation-delay-1000 {
          animation-delay: 1000ms;
        }
        .animation-delay-2000 {
          animation-delay: 2000ms;
        }
        .animation-delay-4000 {
          animation-delay: 4000ms;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(59, 130, 246, 0.5);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(59, 130, 246, 0.8);
        }
      `}</style>
    </div>
  );
}

export default Home;