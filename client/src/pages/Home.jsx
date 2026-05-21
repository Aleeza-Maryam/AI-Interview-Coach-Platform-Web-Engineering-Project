import { useState, useEffect, useRef } from "react"
import { useNavigate, Link } from "react-router-dom"

const roles = [
  "Full-Stack Web Developer",
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Developer",
  "Data Scientist",
  "Data Analyst",
  "Machine Learning Engineer",
  "AI/ML Researcher",
  "DevOps Engineer",
  "Site Reliability Engineer",
  "Cloud Architect",
  "Cybersecurity Specialist",
  "Cybersecurity Analyst",
  "Mobile App Developer",
  "UI/UX Designer",
  "Product Manager",
]

const levels = ["Beginner", "Intermediate", "Advanced"]

function Home() {
  const navigate = useNavigate()
  const historyRef = useRef(null)
  const [user, setUser] = useState(null)
  const [selectedRole, setSelectedRole] = useState(roles[0])
  const [selectedLevel, setSelectedLevel] = useState(levels[1])
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [fetchError, setFetchError] = useState("")
  const [greeting, setGreeting] = useState("")

  useEffect(() => {
    // Set greeting based on time of day
    const hour = new Date().getHours()
    if (hour < 12) setGreeting("Good Morning")
    else if (hour < 18) setGreeting("Good Afternoon")
    else setGreeting("Good Evening")

    const loggedInUser = localStorage.getItem("user")
    if (!loggedInUser) {
      navigate("/login")
      return
    }
    const parsedUser = JSON.parse(loggedInUser)
    setUser(parsedUser)
    // initialize selected role from user profile if available
    setSelectedRole(parsedUser.jobProfile || roles[0])

    fetch(`http://localhost:5000/api/dashboard/user-history/${parsedUser.id}`)
      .then((res) => {
        if (!res.ok) {
          return res.json().then((data) => {
            throw new Error(data.error || "Unable to fetch history.")
          })
        }
        return res.json()
      })
      .then((data) => {
        if (Array.isArray(data)) {
          setHistory(data)
        }
        setLoading(false)
      })
      .catch((err) => {
        console.error("Dashboard metric cluster error:", err)
        setFetchError(err.message || "Unable to load history.")
        setLoading(false)
      })
  }, [navigate])

const handleStart = () => {
  console.log("Navigating with config:", selectedRole, selectedLevel)
  navigate("/interview-session", { state: { role: selectedRole, level: selectedLevel } })
}

const handleOpenInterviewPage = () => {
  // Clean redirect to the standalone /interview page
  navigate('/interview')
}

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    navigate("/login")
    window.location.reload()
  }

  const handleViewHistory = () => {
    historyRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  // Calculate dashboard stats
  const totalInterviews = history.length
  const averageScore = history.length > 0 
    ? Math.round(history.reduce((sum, session) => sum + (session.score || 0), 0) / history.length) 
    : 0
  const bestScore = history.length > 0 
    ? Math.max(...history.map(session => session.score || 0)) 
    : 0
  const recentInterview = history.length > 0 ? history[0] : null

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loadingCard}>
          <div style={styles.loadingSpinner}></div>
          <div style={styles.loadingText}>SYNCHRONIZING DASHBOARD</div>
          <div style={styles.loadingSubtext}>Establishing secure connection...</div>
        </div>
      </div>
    )
  }

  return (
    <div style={styles.container}>
      {/* Background Layer */}
      <div style={styles.bgLayer}>
        <div style={styles.bgGradient1}></div>
        <div style={styles.bgGradient2}></div>
        <div style={styles.bgGradient3}></div>
        <div style={styles.bgGrid}></div>
      </div>

      {/* Navigation */}
      <nav style={styles.nav}>
        <div style={styles.navLeft}>
          <div style={styles.navIndicator}>
            <span style={styles.indicatorDot}></span>
            <span style={styles.indicatorDot}></span>
            <span style={styles.indicatorDot}></span>
          </div>
          <span style={styles.navTitle}>INTERVIEW COACH DASHBOARD</span>
        </div>
        <button onClick={handleLogout} style={styles.logoutButton}>
          TERMINATE SESSION
        </button>
      </nav>

      {/* Main Wrapper */}
      <div style={styles.wrapper}>
        {/* Welcome Section */}
        <div style={styles.welcomeSection}>
          <div style={styles.welcomeContent}>
            <span style={styles.welcomeGreeting}>{greeting},</span>
            <h1 style={styles.welcomeName}>{user?.name?.split(' ')[0] || "Candidate"}</h1>
            <p style={styles.welcomeMessage}>
              Your AI-powered interview preparation platform is ready. Track your progress, 
              practice with realistic questions, and receive instant feedback to ace your next interview.
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <div style={styles.statIcon}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
              </svg>
            </div>
            <div style={styles.statInfo}>
              <span style={styles.statValue}>{totalInterviews}</span>
              <span style={styles.statLabel}>Total Interviews</span>
            </div>
          </div>
          
          <div style={styles.statCard}>
            <div style={styles.statIcon}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="12" cy="12" r="10"/>
                <path d="M12 6v6l4 2"/>
              </svg>
            </div>
            <div style={styles.statInfo}>
              <span style={styles.statValue}>{averageScore}%</span>
              <span style={styles.statLabel}>Average Score</span>
            </div>
          </div>
          
          <div style={styles.statCard}>
            <div style={styles.statIcon}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
              </svg>
            </div>
            <div style={styles.statInfo}>
              <span style={styles.statValue}>{bestScore}%</span>
              <span style={styles.statLabel}>Best Performance</span>
            </div>
          </div>
          
          <div style={styles.statCard}>
            <div style={styles.statIcon}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
                <line x1="8" y1="21" x2="16" y2="21"/>
                <line x1="12" y1="17" x2="12" y2="21"/>
              </svg>
            </div>
            <div style={styles.statInfo}>
              <span style={styles.statValue}>{recentInterview ? new Date(recentInterview.createdAt).toLocaleDateString() : "N/A"}</span>
              <span style={styles.statLabel}>Last Activity</span>
            </div>
          </div>
        </div>

        {/* Profile Section */}
        <div style={styles.profileSection}>
          <div style={styles.profileBadge}>
            <div style={styles.badgeLine}></div>
            <span style={styles.badgeText}>PROFILE OVERVIEW</span>
            <div style={styles.badgeLine}></div>
          </div>
          
          <div style={styles.profileCard}>
            <div style={styles.profileTier}>
              <span style={styles.tierLabel}>ACCOUNT STATUS</span>
              <span style={styles.tierValue}>ACTIVE</span>
            </div>
            
            <h1 style={styles.userName}>{user?.name}</h1>
            
            <div style={styles.userMeta}>
              <div style={styles.metaItem}>
                <span style={styles.metaLabel}>EMAIL ADDRESS</span>
                <span style={styles.metaValue}>{user?.email}</span>
              </div>
              <div style={styles.metaDivider}></div>
              <div style={styles.metaItem}>
                <span style={styles.metaLabel}>TARGET ROLE</span>
                <span style={styles.metaValueHighlight}>{user?.jobProfile || "NOT SET"}</span>
              </div>
              <div style={styles.metaDivider}></div>
              <div style={styles.metaItem}>
                <span style={styles.metaLabel}>MEMBER SINCE</span>
                <span style={styles.metaValue}>{user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}</span>
              </div>
            </div>

            {/* Role & Level Selection */}
              <div style={{width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', marginBottom: '18px'}}>
                <div style={{color: '#94A3B8', fontFamily: 'monospace', fontSize: '10px', letterSpacing: '2px', textTransform: 'uppercase'}}>
                  CONFIGURE INTERVIEW SESSION
                </div>

                <div style={{display: 'flex', gap: '12px', justifyContent: 'center', marginTop: '6px', flexWrap: 'wrap', width: '100%'}}>
                  <select
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value)}
                    style={{padding: '10px 14px', borderRadius: '12px', background: '#0b1220', color: '#cbd5e1', border: '1px solid rgba(59,130,246,0.08)', minWidth: '200px'}}
                  >
                    {roles.map((r) => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>

                  <select
                    value={selectedLevel}
                    onChange={(e) => setSelectedLevel(e.target.value)}
                    style={{padding: '10px 14px', borderRadius: '12px', background: '#0b1220', color: '#cbd5e1', border: '1px solid rgba(59,130,246,0.08)', minWidth: '140px'}}
                  >
                    {levels.map((l) => (
                      <option key={l} value={l}>{l}</option>
                    ))}
                  </select>
                </div>
              </div>

            <div style={styles.actionGroup}>
              <button onClick={handleStart} style={styles.primaryButton}>
                <span style={styles.buttonGlow}></span>
                START NEW INTERVIEW
                <span style={styles.buttonArrow}>→</span>
              </button>
              <button onClick={handleViewHistory} style={styles.secondaryButton}>
                VIEW HISTORY
              </button>

            
            </div>
          </div>
        </div>

        {/* History Section */}
        <div ref={historyRef} style={styles.historySection}>
          <div style={styles.sectionHeader}>
            <div style={styles.headerLine}></div>
            <div style={styles.headerContent}>
              <span style={styles.headerIcon}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                  <polyline points="12 6 12 12 16 14"/>
                </svg>
              </span>
              <span style={styles.headerTitle}>INTERVIEW HISTORY</span>
            </div>
            <div style={styles.headerLine}></div>
          </div>
          
          {fetchError && (
            <div style={styles.errorContainer}>
              <div style={styles.errorIcon}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" y1="8" x2="12" y2="12"/>
                  <line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
              </div>
              <span style={styles.errorText}>RETRIEVAL FAILED: {fetchError}</span>
            </div>
          )}
          
          {history.length === 0 ? (
            <div style={styles.emptyContainer}>
              <div style={styles.emptyIcon}>
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
                </svg>
              </div>
              <p style={styles.emptyTitle}>NO INTERVIEWS YET</p>
              <p style={styles.emptyDescription}>Your interview history is empty. Click "Start New Interview" to begin your preparation journey and track your progress over time.</p>
              <button onClick={handleStart} style={styles.emptyButton}>
                START YOUR FIRST INTERVIEW
              </button>
            </div>
          ) : (
            <div style={styles.historyGrid}>
              {history.map((session, index) => (
                <div key={session._id} style={{...styles.historyCard, animationDelay: `${index * 0.08}s`}} className="history-card">
                  <div style={styles.cardHeader}>
                    <div style={styles.cardDate}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                        <line x1="16" y1="2" x2="16" y2="6"/>
                        <line x1="8" y1="2" x2="8" y2="6"/>
                        <line x1="3" y1="10" x2="21" y2="10"/>
                      </svg>
                      <span>{new Date(session.createdAt).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'short', 
                        day: 'numeric' 
                      })}</span>
                    </div>
                    <div style={styles.cardScore}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
                      </svg>
                      <span>{session.score}%</span>
                    </div>
                  </div>
                  
                  <div style={styles.cardBody}>
                    <h4 style={styles.cardRole}>{session.jobProfile}</h4>
                    <div style={styles.cardMeta}>
                      <span style={styles.cardLevel}>{session.level}</span>
                      <span style={styles.cardType}>{session.questionType || "Standard"}</span>
                    </div>
                    <p style={styles.cardFeedback}>{session.feedback}</p>
                  </div>
                  
                  <div style={styles.cardFooter}>
                    <Link to={`/report?id=${session._id}`} style={styles.viewLink}>
                      <span>VIEW FULL REPORT</span>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="5" y1="12" x2="19" y2="12"/>
                        <polyline points="12 5 19 12 12 19"/>
                      </svg>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Tips Section */}
        <div style={styles.tipsSection}>
          <div style={styles.tipsHeader}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 8v4l3 3M12 2a10 10 0 1 0 10 10"/>
            </svg>
            <span>PRO TIPS</span>
          </div>
          <div style={styles.tipsGrid}>
            <div style={styles.tipCard}>
              <span style={styles.tipNumber}>01</span>
              <p style={styles.tipText}>Practice with different question types to prepare for real interviews</p>
            </div>
            <div style={styles.tipCard}>
              <span style={styles.tipNumber}>02</span>
              <p style={styles.tipText}>Review your past reports to identify areas needing improvement</p>
            </div>
            <div style={styles.tipCard}>
              <span style={styles.tipNumber}>03</span>
              <p style={styles.tipText}>Focus on weak metrics like clarity or depth to boost overall scores</p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes pulse {
          0%, 100% {
            opacity: 0.3;
            transform: scale(1);
          }
          50% {
            opacity: 0.6;
            transform: scale(1.1);
          }
        }
        
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        
        .history-card {
          animation: fadeInUp 0.5s ease-out forwards;
          opacity: 0;
        }
        
        .history-card:hover {
          transform: translateY(-4px);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        button {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          cursor: pointer;
        }
        
        button:hover {
          transform: translateY(-1px);
        }
        
        button:active {
          transform: translateY(1px);
        }
      `}</style>
    </div>
  )
}

const styles = {
  container: {
    minHeight: '100vh',
    width: '100%',
    background: '#070b14',
    fontFamily: '"Inter", system-ui, -apple-system, sans-serif',
    position: 'relative',
    overflowX: 'hidden',
  },

  bgLayer: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: 'none',
    zIndex: 0,
  },

  bgGradient1: {
    position: 'absolute',
    top: '-20%',
    right: '-10%',
    width: '600px',
    height: '600px',
    background: 'radial-gradient(circle, rgba(59, 130, 246, 0.12) 0%, transparent 70%)',
    borderRadius: '50%',
    animation: 'pulse 8s ease-in-out infinite',
  },

  bgGradient2: {
    position: 'absolute',
    bottom: '-20%',
    left: '-10%',
    width: '700px',
    height: '700px',
    background: 'radial-gradient(circle, rgba(34, 211, 238, 0.06) 0%, transparent 70%)',
    borderRadius: '50%',
    animation: 'pulse 10s ease-in-out infinite reverse',
  },

  bgGradient3: {
    position: 'absolute',
    top: '30%',
    left: '25%',
    width: '500px',
    height: '500px',
    background: 'radial-gradient(circle, rgba(139, 92, 246, 0.06) 0%, transparent 70%)',
    borderRadius: '50%',
    animation: 'pulse 12s ease-in-out infinite',
  },

  bgGrid: {
    position: 'absolute',
    inset: 0,
    backgroundImage: 'linear-gradient(rgba(59, 130, 246, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(59, 130, 246, 0.03) 1px, transparent 1px)',
    backgroundSize: '48px 48px',
  },

  loadingContainer: {
    minHeight: '100vh',
    background: '#070b14',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },

  loadingCard: {
    textAlign: 'center',
    padding: '48px',
    background: 'rgba(15, 23, 42, 0.8)',
    backdropFilter: 'blur(12px)',
    borderRadius: '32px',
    border: '1px solid rgba(59, 130, 246, 0.2)',
  },

  loadingSpinner: {
    width: '48px',
    height: '48px',
    margin: '0 auto 20px',
    border: '3px solid rgba(59, 130, 246, 0.15)',
    borderTopColor: '#3b82f6',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },

  loadingText: {
    color: '#60a5fa',
    fontSize: '12px',
    letterSpacing: '3px',
    fontFamily: 'monospace',
    marginBottom: '8px',
  },

  loadingSubtext: {
    color: '#64748b',
    fontSize: '11px',
    letterSpacing: '1px',
  },

  nav: {
    position: 'relative',
    zIndex: 10,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px 40px',
    borderBottom: '1px solid rgba(59, 130, 246, 0.15)',
    background: 'rgba(7, 11, 20, 0.9)',
    backdropFilter: 'blur(16px)',
  },

  navLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
  },

  navIndicator: {
    display: 'flex',
    gap: '6px',
  },

  indicatorDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    background: '#3b82f6',
    animation: 'pulse 1.5s ease-in-out infinite',
  },

  navTitle: {
    fontFamily: 'monospace',
    fontSize: '11px',
    letterSpacing: '2.5px',
    color: '#64748b',
    fontWeight: '500',
  },

  logoutButton: {
    padding: '8px 24px',
    borderRadius: '8px',
    border: '1px solid rgba(239, 68, 68, 0.3)',
    background: 'rgba(127, 29, 29, 0.15)',
    color: '#f87171',
    fontSize: '11px',
    fontWeight: '600',
    fontFamily: 'monospace',
    letterSpacing: '1px',
    backdropFilter: 'blur(4px)',
  },

  wrapper: {
    position: 'relative',
    zIndex: 10,
    maxWidth: '1280px',
    margin: '0 auto',
    padding: '40px 32px',
  },

  welcomeSection: {
    marginBottom: '48px',
    textAlign: 'center',
  },

  welcomeContent: {
    maxWidth: '600px',
    margin: '0 auto',
  },

  welcomeGreeting: {
    fontSize: '14px',
    color: '#64748b',
    fontFamily: 'monospace',
    letterSpacing: '1px',
    display: 'block',
    marginBottom: '8px',
  },

  welcomeName: {
    fontSize: '48px',
    fontWeight: '700',
    background: 'linear-gradient(135deg, #ffffff, #60a5fa, #22d3ee)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    marginBottom: '16px',
  },

  welcomeMessage: {
    fontSize: '15px',
    color: '#94a3b8',
    lineHeight: '1.6',
  },

  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: '20px',
    marginBottom: '48px',
  },

  statCard: {
    background: 'rgba(15, 23, 42, 0.6)',
    border: '1px solid rgba(59, 130, 246, 0.15)',
    borderRadius: '20px',
    padding: '20px',
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    backdropFilter: 'blur(8px)',
  },

  statIcon: {
    width: '48px',
    height: '48px',
    background: 'rgba(59, 130, 246, 0.1)',
    borderRadius: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#60a5fa',
  },

  statInfo: {
    display: 'flex',
    flexDirection: 'column',
  },

  statValue: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#ffffff',
  },

  statLabel: {
    fontSize: '12px',
    color: '#64748b',
    fontFamily: 'monospace',
    letterSpacing: '0.5px',
  },

  profileSection: {
    marginBottom: '56px',
  },

  profileBadge: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '16px',
    marginBottom: '24px',
  },

  badgeLine: {
    width: '40px',
    height: '1px',
    background: 'linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.4), transparent)',
  },

  badgeText: {
    fontFamily: 'monospace',
    fontSize: '10px',
    letterSpacing: '2px',
    color: '#475569',
  },

  profileCard: {
    background: 'linear-gradient(145deg, rgba(15, 23, 42, 0.95) 0%, rgba(7, 11, 20, 0.98) 100%)',
    border: '1px solid rgba(59, 130, 246, 0.2)',
    borderRadius: '32px',
    padding: '48px',
    position: 'relative',
    overflow: 'hidden',
    backdropFilter: 'blur(12px)',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
  },

  profileTier: {
    position: 'absolute',
    top: '24px',
    right: '32px',
    display: 'flex',
    gap: '8px',
    alignItems: 'center',
    padding: '6px 16px',
    background: 'rgba(59, 130, 246, 0.08)',
    borderRadius: '40px',
    border: '1px solid rgba(59, 130, 246, 0.2)',
  },

  tierLabel: {
    fontSize: '9px',
    fontFamily: 'monospace',
    letterSpacing: '1px',
    color: '#64748b',
  },

  tierValue: {
    fontSize: '10px',
    fontWeight: '700',
    color: '#22d3ee',
    letterSpacing: '1px',
  },

  userName: {
    fontSize: '36px',
    fontWeight: '700',
    background: 'linear-gradient(135deg, #ffffff 0%, #94a3b8 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    marginBottom: '24px',
    letterSpacing: '-0.02em',
  },

  userMeta: {
    display: 'flex',
    gap: '32px',
    padding: '20px 0',
    borderTop: '1px solid rgba(59, 130, 246, 0.12)',
    borderBottom: '1px solid rgba(59, 130, 246, 0.12)',
    marginBottom: '32px',
    flexWrap: 'wrap',
  },

  metaItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },

  metaLabel: {
    fontSize: '10px',
    fontFamily: 'monospace',
    letterSpacing: '1px',
    color: '#475569',
  },

  metaValue: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#94a3b8',
  },

  metaValueHighlight: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#60a5fa',
  },

  metaDivider: {
    width: '1px',
    background: 'rgba(59, 130, 246, 0.2)',
  },

  actionGroup: {
    display: 'flex',
    gap: '16px',
    flexWrap: 'wrap',
  },

  primaryButton: {
    position: 'relative',
    padding: '14px 32px',
    background: 'linear-gradient(135deg, #1e40af, #3b82f6)',
    border: 'none',
    borderRadius: '14px',
    color: '#ffffff',
    fontSize: '13px',
    fontWeight: '600',
    letterSpacing: '0.5px',
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },

  buttonGlow: {
    position: 'absolute',
    top: 0,
    left: '-100%',
    width: '100%',
    height: '100%',
    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)',
    animation: 'shimmer 2s infinite',
  },

  buttonArrow: {
    fontSize: '16px',
    transition: 'transform 0.3s ease',
  },

  secondaryButton: {
    padding: '14px 28px',
    background: 'rgba(15, 23, 42, 0.8)',
    border: '1px solid rgba(59, 130, 246, 0.3)',
    borderRadius: '14px',
    color: '#93c5fd',
    fontSize: '13px',
    fontWeight: '500',
    letterSpacing: '0.5px',
  },

  historySection: {
    marginTop: '16px',
  },

  sectionHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '20px',
    marginBottom: '32px',
  },

  headerLine: {
    flex: 1,
    height: '1px',
    background: 'linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.3), transparent)',
  },

  headerContent: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '8px 20px',
    background: 'rgba(59, 130, 246, 0.05)',
    borderRadius: '40px',
    border: '1px solid rgba(59, 130, 246, 0.15)',
  },

  headerIcon: {
    color: '#3b82f6',
    display: 'flex',
    alignItems: 'center',
  },

  headerTitle: {
    fontFamily: 'monospace',
    fontSize: '11px',
    letterSpacing: '2px',
    color: '#64748b',
    fontWeight: '500',
  },

  errorContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '12px',
    padding: '20px',
    background: 'rgba(239, 68, 68, 0.08)',
    borderRadius: '16px',
    border: '1px solid rgba(239, 68, 68, 0.25)',
  },

  errorIcon: {
    color: '#ef4444',
  },

  errorText: {
    color: '#fca5a5',
    fontSize: '13px',
    fontFamily: 'monospace',
  },

  emptyContainer: {
    textAlign: 'center',
    padding: '80px 40px',
    background: 'rgba(15, 23, 42, 0.4)',
    border: '2px dashed rgba(59, 130, 246, 0.15)',
    borderRadius: '28px',
  },

  emptyIcon: {
    color: '#334155',
    marginBottom: '20px',
  },

  emptyTitle: {
    color: '#475569',
    fontSize: '13px',
    letterSpacing: '2px',
    fontFamily: 'monospace',
    marginBottom: '12px',
  },

  emptyDescription: {
    color: '#64748b',
    fontSize: '13px',
    maxWidth: '400px',
    margin: '0 auto 24px',
    lineHeight: '1.6',
  },

  emptyButton: {
    padding: '12px 28px',
    background: 'linear-gradient(135deg, #1e40af, #3b82f6)',
    border: 'none',
    borderRadius: '12px',
    color: '#ffffff',
    fontSize: '12px',
    fontWeight: '600',
    letterSpacing: '0.5px',
  },

  historyGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },

  historyCard: {
    background: 'rgba(15, 23, 42, 0.7)',
    border: '1px solid rgba(59, 130, 246, 0.15)',
    borderRadius: '20px',
    padding: '24px',
    transition: 'all 0.3s ease',
  },

  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
  },

  cardDate: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontFamily: 'monospace',
    fontSize: '11px',
    color: '#64748b',
  },

  cardScore: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '6px 14px',
    background: 'rgba(59, 130, 246, 0.12)',
    borderRadius: '20px',
    color: '#60a5fa',
    fontSize: '13px',
    fontWeight: '700',
  },

  cardBody: {
    marginBottom: '20px',
  },

  cardRole: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#f1f5f9',
    marginBottom: '10px',
  },

  cardMeta: {
    display: 'flex',
    gap: '10px',
    marginBottom: '12px',
    flexWrap: 'wrap',
  },

  cardLevel: {
    fontSize: '10px',
    padding: '3px 10px',
    background: 'rgba(34, 211, 238, 0.12)',
    borderRadius: '12px',
    color: '#22d3ee',
    fontFamily: 'monospace',
  },

  cardType: {
    fontSize: '10px',
    padding: '3px 10px',
    background: 'rgba(139, 92, 246, 0.12)',
    borderRadius: '12px',
    color: '#a78bfa',
    fontFamily: 'monospace',
  },

  cardFeedback: {
    fontSize: '13px',
    color: '#94a3b8',
    lineHeight: '1.5',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
  },

  cardFooter: {
    paddingTop: '16px',
    borderTop: '1px solid rgba(59, 130, 246, 0.1)',
  },

  viewLink: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    color: '#60a5fa',
    fontSize: '12px',
    fontWeight: '500',
    textDecoration: 'none',
    fontFamily: 'monospace',
    letterSpacing: '0.5px',
    transition: 'all 0.3s ease',
  },

  tipsSection: {
    marginTop: '48px',
    padding: '32px',
    background: 'rgba(15, 23, 42, 0.4)',
    borderRadius: '24px',
    border: '1px solid rgba(59, 130, 246, 0.1)',
  },

  tipsHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    justifyContent: 'center',
    marginBottom: '24px',
    color: '#60a5fa',
    fontFamily: 'monospace',
    fontSize: '11px',
    letterSpacing: '1px',
  },

  tipsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '24px',
  },

  tipCard: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
    padding: '16px',
    background: 'rgba(7, 11, 20, 0.5)',
    borderRadius: '16px',
  },

  tipNumber: {
    fontSize: '24px',
    fontWeight: '700',
    color: 'rgba(59, 130, 246, 0.3)',
    fontFamily: 'monospace',
    lineHeight: 1,
  },

  tipText: {
    fontSize: '13px',
    color: '#94a3b8',
    lineHeight: '1.5',
    margin: 0,
  },
}

export default Home