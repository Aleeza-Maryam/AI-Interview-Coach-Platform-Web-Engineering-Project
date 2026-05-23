import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

/* ─── Animated counter hook ─── */
function useCountUp(target, duration = 1200, delay = 0) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    let start = null;
    let raf;
    const timeout = setTimeout(() => {
      const step = (ts) => {
        if (!start) start = ts;
        const progress = Math.min((ts - start) / duration, 1);
        const ease = 1 - Math.pow(1 - progress, 3);
        setValue(Math.round(ease * target));
        if (progress < 1) raf = requestAnimationFrame(step);
      };
      raf = requestAnimationFrame(step);
    }, delay);
    return () => { clearTimeout(timeout); cancelAnimationFrame(raf); };
  }, [target, duration, delay]);
  return value;
}

/* ─── Animated metric bar ─── */
function MetricBar({ metric, idx }) {
  const [visible, setVisible] = useState(false);
  const ref = useRef();
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.3 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  const count = useCountUp(visible ? metric.score : 0, 900, idx * 120);

  return (
    <div ref={ref} className="report-metric-row" style={{ animationDelay: `${idx * 0.1}s` }}>
      <div className="metric-header">
        <span className="metric-label">{metric.name}</span>
        <span className="metric-badge" style={{ '--accent': metric.accent }}>{count}%</span>
      </div>
      <div className="track">
        <div
          className="fill"
          style={{
            width: visible ? `${metric.score}%` : '0%',
            background: metric.gradient,
            transitionDelay: `${idx * 0.12 + 0.2}s`,
          }}
        />
        <div className="track-glow" style={{ left: visible ? `${metric.score}%` : '0%', background: metric.accent, transitionDelay: `${idx * 0.12 + 0.2}s` }} />
      </div>
    </div>
  );
}

/* ─── QA Card ─── */
function QACard({ item, idx }) {
  const [open, setOpen] = useState(false);
  const statusMap = {
    Excellent: { cls: 'status-excellent', dot: '#22d3ee' },
    Strong:    { cls: 'status-strong',    dot: '#3b82f6' },
    default:   { cls: 'status-warn',      dot: '#f59e0b' },
  };
  const s = statusMap[item.status] || statusMap.default;

  return (
    <div className="qa-card" style={{ animationDelay: `${idx * 0.08}s` }}>
      <button className="qa-header" onClick={() => setOpen(o => !o)}>
        <div className="qa-left">
          <span className="qa-index">0{idx + 1}</span>
          <p className="qa-question">{item.question}</p>
        </div>
        <div className="qa-right">
          <span className={`status-pill ${s.cls}`}>
            <span className="status-dot" style={{ background: s.dot }} />
            {item.status}
          </span>
          <span className={`chevron ${open ? 'open' : ''}`}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M3 5l4 4 4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
          </span>
        </div>
      </button>

      <div className={`qa-body ${open ? 'expanded' : ''}`}>
        <div className="qa-inner">
          <div className="answer-block">
            <span className="block-label">Your Response</span>
            <p className="block-text candidate">{item.candidateAnswer}</p>
          </div>
          <div className="answer-block ai-block">
            <span className="block-label ai-label">AI Analysis</span>
            <p className="block-text ai">{item.aiEvaluation}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Main Component ─── */
const Report = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const reportId = new URLSearchParams(location.search || '').get('id');
  const realData = location.state;

  // ✅ ALL HOOKS AT TOP LEVEL (pehle hi call kar do)
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [saveSuccess, setSaveSuccess] = useState('');
  const [reportFetchError, setReportFetchError] = useState('');
  const saveOnceRef = useRef(false);

  // ✅ useCountUp Hook yahan top level pe call ho raha hai
  // Agar reportData null hai to 0 pass kar do
  const overallCount = useCountUp(reportData?.overallScore ?? 0, 1400, 300);

  const getStatus = (score) => {
    if (score >= 7) return 'Passed';
    if (score >= 5) return 'Average';
    return 'Needs Work';
  };

  const getQAStatus = (score) => {
    if (score >= 7) return 'Excellent';
    if (score >= 5) return 'Strong';
    return 'Needs Improvement';
  };

  const buildReport = (source) => {
    const results = Array.isArray(source?.results) ? source.results : [];
    const avgScore = results.length
      ? Math.round(results.reduce((sum, r) => sum + (r.evaluation?.overall || 0), 0) / results.length)
      : 0;
    const avgClarity = results.length
      ? Math.round(results.reduce((sum, r) => sum + (r.evaluation?.clarity || 0), 0) / results.length)
      : 0;
    const avgDepth = results.length
      ? Math.round(results.reduce((sum, r) => sum + (r.evaluation?.depth || 0), 0) / results.length)
      : 0;
    const avgRelevance = results.length
      ? Math.round(results.reduce((sum, r) => sum + (r.evaluation?.relevance || 0), 0) / results.length)
      : 0;

    return {
      jobProfile: source.jobProfile || source.role || 'Unknown Role',
      difficulty: source.level || source.difficulty || 'Unknown Level',
      questionType: source.questionType ?? 'Mixed',
      date: source.createdAt
        ? new Date(source.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
        : new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      overallScore: avgScore * 10,
      status: getStatus(avgScore),
      summary: source.summary || (results.length
        ? `You attempted ${results.length} questions for ${source.jobProfile || source.role} at ${source.level || source.difficulty} level. Your average overall score was ${avgScore}/10. Clarity: ${avgClarity}/10, Depth: ${avgDepth}/10, Relevance: ${avgRelevance}/10. Review individual feedback below to identify areas for improvement.`
        : 'No results available.'),
      metrics: [
        {
          name: 'Clarity',
          score: avgClarity * 10,
          accent: '#3b82f6',
          gradient: 'linear-gradient(90deg, #1d4ed8, #3b82f6)',
        },
        {
          name: 'Depth',
          score: avgDepth * 10,
          accent: '#22d3ee',
          gradient: 'linear-gradient(90deg, #0e7490, #22d3ee)',
        },
        {
          name: 'Relevance',
          score: avgRelevance * 10,
          accent: '#818cf8',
          gradient: 'linear-gradient(90deg, #4338ca, #818cf8)',
        },
      ],
      detailedQA: results.map((r) => ({
        question: r.question,
        candidateAnswer: r.answer || 'No answer provided',
        aiEvaluation: r.evaluation?.feedback || 'No feedback available',
        status: getQAStatus(r.evaluation?.overall || 0),
      })),
      results,
    };
  };

  const saveReport = async (payload) => {
    const storedUser = localStorage.getItem('user');
    const parsedUser = storedUser ? JSON.parse(storedUser) : null;

    if (!parsedUser?.id) {
      setSaveError('Cannot save report. User not authenticated.');
      return;
    }

    setSaving(true);
    setSaveError('');

    try {
      const response = await axios.post('http://localhost:5000/api/dashboard/save-report', {
        userId: parsedUser.id,
        jobProfile: payload.jobProfile,
        level: payload.difficulty,
        questionType: payload.questionType,
        score: payload.overallScore,
        feedback: payload.summary,
        results: payload.results,
      });

      if (response.data?.report) {
        setSaveSuccess('Report saved to your history successfully.')
        window.history.replaceState(null, '', `/report?id=${response.data.report._id}`)
      } else {
        setSaveError('Report was generated but saving to history failed.')
      }
    } catch (error) {
      setSaveError(error.response?.data?.error || error.message || 'Unable to save report.')
    } finally {
      setSaving(false)
    }
  };

  const loadSavedReport = async (id) => {
    setLoading(true);
    setReportFetchError('');
    try {
      const response = await axios.get(`http://localhost:5000/api/dashboard/report/${id}`)
      setReportData(buildReport(response.data))
    } catch (error) {
      setReportFetchError(error.response?.data?.error || error.message || 'Unable to load saved report.')
    } finally {
      setLoading(false)
    }
  };

  useEffect(() => {
    if (realData?.results?.length) {
      const built = buildReport({
        ...realData,
        jobProfile: realData.role,
        level: realData.level,
        questionType: realData.questionType || 'Mixed',
      })
      setReportData(built)
      setLoading(false)
      // Prevent duplicate saves in StrictMode (dev) by guarding with a ref
      if (!saveOnceRef.current) {
        saveOnceRef.current = true
        saveReport(built)
      }
    } else if (reportId) {
      loadSavedReport(reportId)
    } else {
      setReportFetchError('No report data to display.')
      setLoading(false)
    }
  }, [realData, reportId]);

  // ✅ Ab conditional returns HOOKS ke BAAD aayenge (yeh sahi hai)
  if (loading) {
    return (
      <div className="min-h-screen use-app-bg text-app flex items-center justify-center px-4 py-8">
        <div className="text-center space-y-3">
          <div className="mx-auto h-14 w-14 rounded-full border-4 border-blue-500 border-t-transparent animate-spin"></div>
          <p className="text-sm text-muted">Loading report details...</p>
        </div>
      </div>
    )
  }

  if (reportFetchError) {
    return (
      <div className="min-h-screen use-app-bg text-app flex flex-col items-center justify-center px-4 py-8 gap-6">
        <div className="max-w-md text-center">
          <p className="text-red-300 font-semibold">{reportFetchError}</p>
          <p className="text-muted mt-3">Please try again or return to the dashboard.</p>
        </div>
        <button onClick={() => navigate('/')} className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-app font-semibold">
          Back to Dashboard
        </button>
      </div>
    )
  }

  if (!reportData) {
    return (
      <div className="min-h-screen use-app-bg text-app flex items-center justify-center px-4 py-8">
        <div className="text-center">
          <p className="text-muted">No report data available. Please complete an interview or select a saved report.</p>
          <button onClick={() => navigate('/')} className="mt-6 px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-app font-semibold">
            Back to Dashboard
          </button>
        </div>
      </div>
    )
  }

  // ✅ Ab render return karo (yahan Hook call nahi hai)
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Mono:wght@300;400;500&family=Instrument+Serif:ital@0;1&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --bg:        var(--bg);
          --surface:   var(--card);
          --surface2:  var(--card);
          --border:    rgba(59,130,246,0.08);
          --border-hi: rgba(59,130,246,0.12);
          --blue:      var(--accent);
          --blue-dim:  var(--accent);
          --cyan:      var(--accent);
          --indigo:    var(--accent);
          --text:      var(--text);
          --text-dim:  var(--muted);
          --text-mute: var(--muted);
          --mono:      'DM Mono', monospace;
          --sans:      'Syne', sans-serif;
          --serif:     'Instrument Serif', serif;
        }

        .report-root {
          min-height: 100vh;
          background: var(--bg);
          color: var(--text);
          font-family: var(--sans);
          padding: 0;
          position: relative;
          overflow-x: hidden;
        }

        .report-root::before {
          content: '';
          position: fixed;
          inset: 0;
          background-image:
            linear-gradient(rgba(59,122,246,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(59,122,246,0.04) 1px, transparent 1px);
          background-size: 48px 48px;
          pointer-events: none;
          z-index: 0;
        }

        .orb {
          position: fixed;
          border-radius: 50%;
          filter: blur(90px);
          pointer-events: none;
          z-index: 0;
          animation: orbFloat 8s ease-in-out infinite alternate;
        }
        .orb-1 { width: 500px; height: 500px; top: -120px; right: -100px; background: rgba(29,78,216,0.12); }
        .orb-2 { width: 400px; height: 400px; bottom: 100px; left: -80px;  background: rgba(34,211,238,0.07); animation-delay: -4s; }
        @keyframes orbFloat { from { transform: translate(0,0) scale(1); } to { transform: translate(20px, 30px) scale(1.05); } }

        .report-wrap { position: relative; z-index: 1; max-width: 860px; margin: 0 auto; padding: 40px 24px 80px; }

        .report-nav {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 48px;
          padding-bottom: 20px;
          border-bottom: 1px solid var(--border);
          animation: fadeDown 0.5s ease both;
        }
        .nav-brand {
          display: flex;
          align-items: center;
          gap: 10px;
          font-family: var(--mono);
          font-size: 10px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--text-dim);
        }
        .brand-dot {
          width: 8px; height: 8px; border-radius: 50%;
          background: var(--blue);
          box-shadow: 0 0 10px var(--blue);
          animation: pulse 2s ease-in-out infinite;
        }
        @keyframes pulse { 0%,100% { opacity:1; transform:scale(1); } 50% { opacity:0.5; transform:scale(0.85); } }

        .nav-back {
          font-family: var(--mono);
          font-size: 10px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--text-dim);
          background: var(--surface);
          border: 1px solid var(--border);
          padding: 8px 16px;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s;
        }
        .nav-back:hover { color: var(--blue); border-color: var(--blue); background: rgba(59,122,246,0.07); }

        .hero-card {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 20px;
          padding: 36px;
          margin-bottom: 24px;
          position: relative;
          overflow: hidden;
          animation: fadeUp 0.6s ease 0.1s both;
        }
        .hero-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 3px;
          background: linear-gradient(90deg, var(--blue-dim), var(--blue), var(--cyan));
        }
        .hero-card::after {
          content: '';
          position: absolute;
          top: -60px; right: -60px;
          width: 200px; height: 200px;
          background: radial-gradient(circle, rgba(59,122,246,0.08) 0%, transparent 70%);
          pointer-events: none;
        }

        .hero-top { display: flex; justify-content: space-between; align-items: flex-start; gap: 24px; flex-wrap: wrap; }

        .hero-tags { display: flex; gap: 8px; margin-bottom: 12px; }
        .tag {
          font-family: var(--mono);
          font-size: 9px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          padding: 4px 10px;
          border-radius: 6px;
          font-weight: 500;
        }
        .tag-blue   { background: rgba(59,122,246,0.12); color: #7ab0fa; border: 1px solid rgba(59,122,246,0.25); }
        .tag-green  { background: rgba(34,197,94,0.10);  color: #4ade80; border: 1px solid rgba(34,197,94,0.25); }

        .hero-title {
          font-size: clamp(26px, 4vw, 36px);
          font-weight: 800;
          color: var(--text);
          letter-spacing: -0.02em;
          line-height: 1.1;
          margin-bottom: 6px;
        }
        .hero-date {
          font-family: var(--mono);
          font-size: 10px;
          color: var(--text-mute);
          letter-spacing: 0.08em;
        }

        .score-ring {
          display: flex;
          align-items: center;
          gap: 16px;
          background: var(--surface2);
          border: 1px solid var(--border);
          border-radius: 14px;
          padding: 16px 20px;
          min-width: 180px;
          flex-shrink: 0;
        }
        .ring-labels { text-align: right; }
        .ring-label-top {
          font-family: var(--mono);
          font-size: 9px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--text-mute);
          margin-bottom: 2px;
        }
        .ring-label-sub {
          font-family: var(--mono);
          font-size: 9px;
          color: var(--text-mute);
        }
        .ring-number {
          font-size: 32px;
          font-weight: 800;
          color: var(--blue);
          background: rgba(59,122,246,0.08);
          border: 1px solid rgba(59,122,246,0.2);
          border-radius: 12px;
          width: 64px; height: 64px;
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 0 24px rgba(59,122,246,0.15);
          transition: box-shadow 0.3s;
          flex-shrink: 0;
        }
        .ring-number:hover { box-shadow: 0 0 36px rgba(59,122,246,0.3); }

        .hero-summary {
          margin-top: 24px;
          padding-top: 24px;
          border-top: 1px solid var(--border);
        }
        .section-label {
          font-family: var(--mono);
          font-size: 9px;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: var(--text-mute);
          margin-bottom: 10px;
        }
        .summary-text {
          font-family: var(--serif);
          font-style: italic;
          font-size: 15px;
          color: #a8bcd8;
          line-height: 1.7;
          background: rgba(59,122,246,0.04);
          border: 1px dashed rgba(59,122,246,0.15);
          border-radius: 12px;
          padding: 16px 20px;
        }

        .metrics-card {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 20px;
          padding: 32px 36px;
          margin-bottom: 24px;
          animation: fadeUp 0.6s ease 0.2s both;
        }

        .report-metric-row {
          margin-bottom: 24px;
          animation: fadeUp 0.5s ease both;
        }
        .report-metric-row:last-child { margin-bottom: 0; }

        .metric-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
        }
        .metric-label {
          font-size: 12px;
          font-weight: 600;
          color: var(--text);
          letter-spacing: 0.01em;
        }
        .metric-badge {
          font-family: var(--mono);
          font-size: 11px;
          font-weight: 500;
          color: var(--accent, var(--blue));
          background: rgba(59,122,246,0.08);
          border: 1px solid rgba(59,122,246,0.18);
          padding: 2px 8px;
          border-radius: 6px;
        }

        .track {
          position: relative;
          height: 6px;
          background: rgba(255,255,255,0.04);
          border-radius: 99px;
          overflow: visible;
        }
        .fill {
          height: 100%;
          border-radius: 99px;
          transition: width 0.9s cubic-bezier(0.34,1.56,0.64,1);
          position: relative;
        }
        .track-glow {
          position: absolute;
          top: 50%;
          transform: translate(-50%, -50%);
          width: 10px; height: 10px;
          border-radius: 50%;
          transition: left 0.9s cubic-bezier(0.34,1.56,0.64,1);
          box-shadow: 0 0 10px 3px currentColor;
          opacity: 0.7;
        }

        .qa-section { animation: fadeUp 0.6s ease 0.3s both; }
        .qa-section-label { margin-bottom: 16px; }

        .qa-card {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 16px;
          margin-bottom: 12px;
          overflow: hidden;
          transition: border-color 0.2s;
          animation: fadeUp 0.5s ease both;
        }
        .qa-card:hover { border-color: var(--border-hi); }

        .qa-header {
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 16px;
          padding: 20px 24px;
          background: none;
          border: none;
          cursor: pointer;
          text-align: left;
          color: inherit;
        }
        .qa-left { display: flex; gap: 12px; align-items: flex-start; flex: 1; }
        .qa-index {
          font-family: var(--mono);
          font-size: 10px;
          font-weight: 500;
          color: var(--blue);
          background: rgba(59,122,246,0.1);
          border: 1px solid rgba(59,122,246,0.2);
          width: 28px; height: 22px;
          border-radius: 6px;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
          margin-top: 1px;
        }
        .qa-question {
          font-size: 13px;
          font-weight: 600;
          color: var(--text);
          line-height: 1.5;
        }
        .qa-right { display: flex; align-items: center; gap: 10px; flex-shrink: 0; }

        .status-pill {
          font-family: var(--mono);
          font-size: 9px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          padding: 4px 10px;
          border-radius: 20px;
          display: flex;
          align-items: center;
          gap: 5px;
          white-space: nowrap;
        }
        .status-dot { width: 5px; height: 5px; border-radius: 50%; flex-shrink: 0; }
        .status-excellent { background: rgba(34,211,238,0.1);  color: #22d3ee; border: 1px solid rgba(34,211,238,0.2); }
        .status-strong    { background: rgba(59,122,246,0.1);  color: #7ab0fa; border: 1px solid rgba(59,122,246,0.2); }
        .status-warn      { background: rgba(245,158,11,0.1);  color: #fbbf24; border: 1px solid rgba(245,158,11,0.2); }

        .chevron {
          color: var(--text-mute);
          transition: transform 0.3s ease, color 0.2s;
        }
        .chevron.open { transform: rotate(180deg); color: var(--blue); }

        .qa-body {
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.4s cubic-bezier(0.4,0,0.2,1);
        }
        .qa-body.expanded { max-height: 600px; }

        .qa-inner {
          padding: 0 24px 24px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          border-top: 1px solid var(--border);
          padding-top: 16px;
        }
        .answer-block { display: flex; flex-direction: column; gap: 6px; }
        .block-label {
          font-family: var(--mono);
          font-size: 9px;
          letter-spacing: 0.13em;
          text-transform: uppercase;
          color: var(--text-mute);
        }
        .ai-label { color: #5ba0f5; }
        .block-text {
          font-size: 12px;
          line-height: 1.65;
          padding: 12px 14px;
          border-radius: 10px;
        }
        .block-text.candidate {
          font-family: var(--mono);
          color: #8aa8cc;
          background: rgba(255,255,255,0.02);
          border: 1px solid var(--border);
        }
        .block-text.ai {
          color: #a8c8f0;
          background: rgba(59,122,246,0.05);
          border: 1px solid rgba(59,122,246,0.15);
        }

        .action-bar {
          display: flex;
          justify-content: flex-end;
          margin-top: 32px;
          animation: fadeUp 0.6s ease 0.5s both;
        }
        .btn-download {
          font-family: var(--mono);
          font-size: 10px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #e2eaf8;
          background: linear-gradient(135deg, var(--blue-dim), var(--blue));
          border: none;
          padding: 14px 28px;
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.2s;
          box-shadow: 0 4px 24px rgba(59,122,246,0.25);
          position: relative;
          overflow: hidden;
        }
        .btn-download::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, transparent 40%, rgba(255,255,255,0.08));
          pointer-events: none;
        }
        .btn-download:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 32px rgba(59,122,246,0.4);
        }
        .btn-download:active { transform: translateY(0); }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0);    }
        }
        @keyframes fadeDown {
          from { opacity: 0; transform: translateY(-12px); }
          to   { opacity: 1; transform: translateY(0);     }
        }

        @media (max-width: 600px) {
          .report-wrap { padding: 24px 16px 60px; }
          .hero-card   { padding: 24px 20px; }
          .score-ring  { min-width: unset; }
          .metrics-card { padding: 24px 20px; }
          .qa-header   { padding: 16px; }
          .qa-inner    { padding: 12px 16px 20px; padding-top: 14px; }
        }
      `}</style>

      <div className="report-root">
        <div className="orb orb-1" />
        <div className="orb orb-2" />

        <div className="report-wrap">
          <nav className="report-nav">
            <div className="nav-brand">
              <div className="brand-dot" />
              AI Analytics Engine / Session Report
            </div>
            <button className="nav-back" onClick={() => navigate('/')}>
              Back to Dashboard
            </button>
          </nav>

          {saveError && (
            <div className="p-4 rounded-2xl border border-red-500/20 bg-red-500/10 text-red-200 text-sm mb-4">
              Save failed: {saveError}
            </div>
          )}
          {saveSuccess && (
            <div className="p-4 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-200 text-sm mb-4">
              {saveSuccess}
            </div>
          )}
          {saving && (
            <div className="p-4 rounded-2xl border border-blue-500/20 bg-blue-500/10 text-blue-200 text-sm mb-4">
              Saving report to your history...
            </div>
          )}

          <div className="hero-card">
            <div className="hero-top">
              <div>
                <div className="hero-tags">
                  <span className="tag tag-blue">{reportData.difficulty} Session</span>
                  <span className="tag tag-green">{reportData.status}</span>
                </div>
                <h1 className="hero-title">{reportData.jobProfile}</h1>
                <p className="hero-date">Timestamp: {reportData.date}</p>
              </div>
              <div className="score-ring">
                <div className="ring-labels">
                  <div className="ring-label-top">Overall Score</div>
                  <div className="ring-label-sub">Benchmark: 70%</div>
                </div>
                <div className="ring-number">{overallCount}%</div>
              </div>
            </div>

            <div className="hero-summary">
              <div className="section-label">Executive Summary</div>
              <p className="summary-text">{reportData.summary}</p>
            </div>
          </div>

          <div className="metrics-card">
            <div className="section-label" style={{ marginBottom: 24 }}>Core Competency Performance</div>
            {(reportData.metrics || []).map((m, i) => (
              <MetricBar key={i} metric={m} idx={i} />
            ))}
          </div>

          <div className="qa-section">
            <div className="section-label qa-section-label">Granular Transcript Review</div>
            {(reportData.detailedQA || []).map((item, idx) => (
              <QACard key={idx} item={item} idx={idx} />
            ))}
          </div>

          <div className="action-bar">
            <button className="btn-download" onClick={() => window.print()}>
              Download Session Transcript (PDF)
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Report;