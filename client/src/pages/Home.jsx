import { useState, useEffect, useRef } from "react"
import { useNavigate, Link } from "react-router-dom"

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
  const historyRef = useRef(null)
  const [user, setUser] = useState(null)
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [fetchError, setFetchError] = useState("")

  useEffect(() => {
    const loggedInUser = localStorage.getItem("user")
    if (!loggedInUser) {
      navigate("/login")
      return
    }
    const parsedUser = JSON.parse(loggedInUser)
    setUser(parsedUser)

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
    navigate("/interview")
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

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loadingContent}>
          <div style={styles.loadingSpinner}></div>
          <p style={styles.loadingText}>SYNCING DASHBOARD METRICS...</p>
        </div>
      </div>
    )
  }

  return (
    <div style={styles.container}>
      {/* Animated Background */}
      <div style={styles.bgAnimation}>
        <div style={styles.bgOrb1}></div>
        <div style={styles.bgOrb2}></div>
        <div style={styles.bgOrb3}></div>
        <div style={styles.bgGrid}></div>
      </div>

      {/* Navigation */}
      <nav style={styles.nav}>
        <div style={styles.navLeft}>
          <div style={styles.navDots}>
            <span style={{ ...styles.navDot, animationDelay: '0s' }}></span>
            <span style={{ ...styles.navDot, animationDelay: '0.3s' }}></span>
            <span style={{ ...styles.navDot, animationDelay: '0.6s' }}></span>
          </div>
          <span style={styles.navBrand}>SECURE PROFILE PORTAL</span>
        </div>
        <button onClick={handleLogout} style={styles.logoutBtn}>
          Disconnect Terminal (Logout)
        </button>
      </nav>

      {/* Main Content */}
      <div style={styles.mainContent}>
        {/* Profile Card */}
        <div style={styles.profileCard}>
          <div style={styles.profileHeader}>
            <div style={styles.authBadge}>
              <span style={styles.authIcon}>⚡</span>
              <span style={styles.authText}>Authorized Operating Node</span>
            </div>
            <div style={styles.tierBadge}>
              TIER: <span style={styles.tierValue}>PREMIUM</span>
            </div>
          </div>
          
          <h1 style={styles.userName}>{user?.name}</h1>
          
          <div style={styles.userDetails}>
            <div style={styles.detailItem}>
              <span style={styles.detailLabel}>EMAIL</span>
              <span style={styles.detailValue}>{user?.email}</span>
            </div>
            <div style={styles.detailDivider}></div>
            <div style={styles.detailItem}>
              <span style={styles.detailLabel}>PROFILE</span>
              <span style={styles.detailValueHighlight}>{user?.jobProfile || "Not Set"}</span>
            </div>
          </div>

          <div style={styles.buttonGroup}>
            <button onClick={handleStart} style={styles.startBtn}>
              <span style={styles.btnIcon}>🚀</span>
              Start Interview Simulation
              <span style={styles.btnArrow}>→</span>
            </button>
            <button onClick={handleViewHistory} style={styles.historyBtn}>
              <span style={styles.btnIcon}>📋</span>
              View History
            </button>
          </div>
        </div>

        {/* History Section */}
        <div ref={historyRef} id="history-section" style={styles.historySection}>
          <div style={styles.sectionHeader}>
            <div style={styles.sectionLine}></div>
            <h3 style={styles.sectionTitle}>PAST INTERVIEW SESSIONS</h3>
            <div style={styles.sectionLine}></div>
          </div>
          
          {fetchError && (
            <div style={styles.errorBox}>
              <span style={styles.errorIcon}>⚠️</span>
              <span>Unable to load history: {fetchError}</span>
            </div>
          )}
          
          {history.length === 0 ? (
            <div style={styles.emptyState}>
              <div style={styles.emptyIcon}>📭</div>
              <p style={styles.emptyText}>No past interview records.</p>
              <p style={styles.emptySubtext}>Click "Start Interview Simulation" to begin your first session.</p>
            </div>
          ) : (
            <div style={styles.historyList}>
              {history.map((session, index) => (
                <div 
                  key={session._id} 
                  style={{ ...styles.historyCard, animationDelay: `${index * 0.1}s` }}
                  className="history-card"
                >
                  <div style={styles.cardLeft}>
                    <div style={styles.cardDate}>
                      <span style={styles.calendarIcon}>📅</span>
                      {new Date(session.createdAt).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </div>
                    <h4 style={styles.cardTitle}>
                      {session.jobProfile}
                      <span style={styles.cardLevel}>{session.level}</span>
                    </h4>
                    <p style={styles.cardFeedback}>{session.feedback}</p>
                  </div>
                  
                  <div style={styles.cardRight}>
                    <div style={styles.scoreBadge}>
                      <svg style={styles.scoreIcon} viewBox="0 0 24 24" fill="none">
                        <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="currentColor"/>
                      </svg>
                      <span style={styles.scoreValue}>{session.score}%</span>
                    </div>
                    <Link 
                      to={`/report?id=${session._id}`} 
                      style={styles.viewReportBtn}
                    >
                      View Report
                      <span style={styles.btnSmallArrow}>→</span>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <style>{`
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

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 0.4;
            transform: scale(1);
          }
          50% {
            opacity: 0.8;
            transform: scale(1.05);
          }
        }

        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }

        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        .history-card {
          animation: fadeInUp 0.5s ease-out forwards;
          opacity: 0;
        }

        .history-card:hover {
          transform: translateY(-2px);
          transition: all 0.3s ease;
        }

        button, .history-card, .view-report-btn {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
      `}</style>
    </div>
  )
}

const styles = {
  // Container Styles
  container: {
    minHeight: '100vh',
    width: '100%',
    background: '#0a0f1e',
    color: '#e2e8f0',
    fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
    position: 'relative',
    overflowX: 'hidden',
  },

  // Animated Background
  bgAnimation: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: 'none',
    zIndex: 0,
  },
  bgOrb1: {
    position: 'absolute',
    top: '-10%',
    right: '-10%',
    width: '500px',
    height: '500px',
    background: 'radial-gradient(circle, rgba(59,130,246,0.15) 0%, transparent 70%)',
    borderRadius: '50%',
    animation: 'pulse 8s ease-in-out infinite',
  },
  bgOrb2: {
    position: 'absolute',
    bottom: '-10%',
    left: '-10%',
    width: '600px',
    height: '600px',
    background: 'radial-gradient(circle, rgba(34,211,238,0.08) 0%, transparent 70%)',
    borderRadius: '50%',
    animation: 'pulse 10s ease-in-out infinite reverse',
  },
  bgOrb3: {
    position: 'absolute',
    top: '40%',
    left: '30%',
    width: '400px',
    height: '400px',
    background: 'radial-gradient(circle, rgba(139,92,246,0.08) 0%, transparent 70%)',
    borderRadius: '50%',
    animation: 'pulse 12s ease-in-out infinite',
  },
  bgGrid: {
    position: 'absolute',
    inset: 0,
    backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(59,130,246,0.05) 1px, transparent 1px)',
    backgroundSize: '40px 40px',
  },

  // Loading Styles
  loadingContainer: {
    minHeight: '100vh',
    background: '#0a0f1e',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingContent: {
    textAlign: 'center',
  },
  loadingSpinner: {
    width: '48px',
    height: '48px',
    border: '3px solid rgba(59,130,246,0.2)',
    borderTopColor: '#3b82f6',
    borderRadius: '50%',
    margin: '0 auto 16px',
    animation: 'spin 1s linear infinite',
  },
  loadingText: {
    color: '#3b82f6',
    fontFamily: 'monospace',
    fontSize: '12px',
    letterSpacing: '2px',
  },

  // Navigation
  nav: {
    position: 'relative',
    zIndex: 10,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 32px',
    borderBottom: '1px solid rgba(59,130,246,0.2)',
    background: 'rgba(15,23,42,0.8)',
    backdropFilter: 'blur(12px)',
  },
  navLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  navDots: {
    display: 'flex',
    gap: '6px',
  },
  navDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    background: '#3b82f6',
    animation: 'pulse 1.5s ease-in-out infinite',
  },
  navBrand: {
    fontFamily: 'monospace',
    fontSize: '11px',
    letterSpacing: '2px',
    color: '#64748b',
    textTransform: 'uppercase',
  },
  logoutBtn: {
    padding: '8px 20px',
    borderRadius: '12px',
    border: '1px solid rgba(239,68,68,0.3)',
    background: 'rgba(127,29,29,0.2)',
    color: '#f87171',
    fontSize: '11px',
    fontWeight: 'bold',
    fontFamily: 'monospace',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },

  // Main Content
  mainContent: {
    position: 'relative',
    zIndex: 10,
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '32px 24px',
  },

  // Profile Card
  profileCard: {
    background: 'linear-gradient(135deg, rgba(30,41,59,0.9) 0%, rgba(15,23,42,0.95) 100%)',
    border: '1px solid rgba(59,130,246,0.25)',
    borderRadius: '28px',
    padding: '40px',
    marginBottom: '48px',
    position: 'relative',
    overflow: 'hidden',
    backdropFilter: 'blur(10px)',
    boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
  },
  profileHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
    flexWrap: 'wrap',
    gap: '12px',
  },
  authBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '6px 14px',
    background: 'rgba(59,130,246,0.1)',
    borderRadius: '20px',
    border: '1px solid rgba(59,130,246,0.2)',
  },
  authIcon: {
    fontSize: '12px',
  },
  authText: {
    fontFamily: 'monospace',
    fontSize: '10px',
    letterSpacing: '1px',
    color: '#60a5fa',
    textTransform: 'uppercase',
  },
  tierBadge: {
    padding: '6px 14px',
    background: 'linear-gradient(135deg, rgba(59,130,246,0.2), rgba(34,211,238,0.1))',
    borderRadius: '20px',
    fontFamily: 'monospace',
    fontSize: '10px',
    color: '#94a3b8',
    letterSpacing: '1px',
  },
  tierValue: {
    color: '#22d3ee',
    fontWeight: 'bold',
    marginLeft: '4px',
  },
  userName: {
    fontSize: '42px',
    fontWeight: '800',
    background: 'linear-gradient(135deg, #ffffff, #93c5fd, #67e8f9)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    marginBottom: '16px',
    letterSpacing: '-0.02em',
  },
  userDetails: {
    display: 'flex',
    gap: '24px',
    padding: '16px 0',
    borderTop: '1px solid rgba(59,130,246,0.15)',
    borderBottom: '1px solid rgba(59,130,246,0.15)',
    marginBottom: '28px',
    flexWrap: 'wrap',
  },
  detailItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  detailLabel: {
    fontFamily: 'monospace',
    fontSize: '10px',
    letterSpacing: '1px',
    color: '#64748b',
  },
  detailValue: {
    fontSize: '14px',
    color: '#cbd5e1',
    fontWeight: '500',
  },
  detailValueHighlight: {
    fontSize: '14px',
    color: '#60a5fa',
    fontWeight: '600',
  },
  detailDivider: {
    width: '1px',
    background: 'rgba(59,130,246,0.2)',
  },
  buttonGroup: {
    display: 'flex',
    gap: '16px',
    flexWrap: 'wrap',
  },
  startBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '14px 32px',
    background: 'linear-gradient(135deg, #2563eb, #3b82f6)',
    border: 'none',
    borderRadius: '16px',
    color: '#ffffff',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 20px rgba(37,99,235,0.3)',
  },
  historyBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '14px 28px',
    background: 'rgba(30,41,59,0.8)',
    border: '1px solid rgba(59,130,246,0.3)',
    borderRadius: '16px',
    color: '#93c5fd',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  btnIcon: {
    fontSize: '16px',
  },
  btnArrow: {
    marginLeft: '4px',
    transition: 'transform 0.3s ease',
  },
  btnSmallArrow: {
    marginLeft: '6px',
    transition: 'transform 0.3s ease',
  },

  // History Section
  historySection: {
    marginTop: '16px',
  },
  sectionHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    marginBottom: '28px',
  },
  sectionLine: {
    flex: 1,
    height: '1px',
    background: 'linear-gradient(90deg, transparent, rgba(59,130,246,0.3), transparent)',
  },
  sectionTitle: {
    fontFamily: 'monospace',
    fontSize: '11px',
    letterSpacing: '2px',
    color: '#64748b',
    fontWeight: 'normal',
  },
  errorBox: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '16px',
    background: 'rgba(239,68,68,0.1)',
    border: '1px solid rgba(239,68,68,0.3)',
    borderRadius: '16px',
    color: '#fca5a5',
    fontSize: '14px',
  },
  errorIcon: {
    fontSize: '18px',
  },
  emptyState: {
    textAlign: 'center',
    padding: '64px 32px',
    background: 'rgba(30,41,59,0.4)',
    border: '2px dashed rgba(59,130,246,0.2)',
    borderRadius: '24px',
  },
  emptyIcon: {
    fontSize: '64px',
    marginBottom: '16px',
    opacity: 0.5,
  },
  emptyText: {
    color: '#94a3b8',
    fontSize: '16px',
    marginBottom: '8px',
  },
  emptySubtext: {
    color: '#64748b',
    fontSize: '13px',
  },
  historyList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  historyCard: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '24px',
    background: 'rgba(30,41,59,0.6)',
    border: '1px solid rgba(59,130,246,0.2)',
    borderRadius: '20px',
    transition: 'all 0.3s ease',
    flexWrap: 'wrap',
    gap: '20px',
  },
  cardLeft: {
    flex: 1,
  },
  cardDate: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontFamily: 'monospace',
    fontSize: '11px',
    color: '#64748b',
    marginBottom: '8px',
  },
  calendarIcon: {
    fontSize: '12px',
  },
  cardTitle: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#f1f5f9',
    marginBottom: '8px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    flexWrap: 'wrap',
  },
  cardLevel: {
    fontSize: '11px',
    fontWeight: '500',
    padding: '3px 10px',
    background: 'rgba(34,211,238,0.15)',
    borderRadius: '20px',
    color: '#22d3ee',
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
  cardRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    flexShrink: 0,
  },
  scoreBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '8px 16px',
    background: 'rgba(59,130,246,0.15)',
    borderRadius: '40px',
    border: '1px solid rgba(59,130,246,0.3)',
  },
  scoreIcon: {
    width: '14px',
    height: '14px',
    color: '#fbbf24',
  },
  scoreValue: {
    fontSize: '18px',
    fontWeight: '800',
    color: '#60a5fa',
  },
  viewReportBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '10px 20px',
    background: 'rgba(15,23,42,0.8)',
    border: '1px solid rgba(59,130,246,0.3)',
    borderRadius: '40px',
    color: '#93c5fd',
    fontSize: '12px',
    fontWeight: '500',
    textDecoration: 'none',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
}

export default Home