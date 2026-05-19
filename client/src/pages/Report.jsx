import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Report = () => {
  const navigate = useNavigate();
  
  // Is state mein poora wahi structure hai jo AI response generate hone ke baad frontend ko milega
  const [reportData] = useState({
    jobProfile: "Cybersecurity Analyst",
    difficulty: "Intermediate",
    date: "May 19, 2026",
    overallScore: 78,
    status: "Passed",
    summary: "Candidate demonstrates strong baseline technical proficiency in network perimeter defense and firewall configuration. Response patterns indicate exceptional structural logic under operational simulated pressure, though advanced zero-trust authorization layers require minor architectural refinement.",
    
    // Core areas ka matrix breakdown
    metrics: [
      { name: "Technical Accuracy & Core Logic", score: 85, color: "bg-blue-600", lightColor: "bg-blue-50 text-blue-600" },
      { name: "Threat Modeling & Scenario Analysis", score: 80, color: "bg-cyan-600", lightColor: "bg-cyan-50 text-cyan-600" },
      { name: "Communication & Professional Delivery", score: 70, color: "bg-slate-600", lightColor: "bg-slate-100 text-slate-700" }
    ],

    // Har individual question jo interview mein poocha gaya tha, candidate ka answer, aur AI ka evaluation review
    detailedQA: [
      {
        question: "How do you mitigate a distributed denial-of-service (DDoS) amplification attack at the network layer?",
        candidateAnswer: "I would implement rate limiting protocols at the edge firewall, distribute the incoming high-volume traffic across multiple scrubbing centers using BGP Anycast routing, and temporarily drop suspicious UDP packets.",
        aiEvaluation: "Excellent mitigation framework. The integration of BGP Anycast and external traffic scrubbing centers shows deep industrial insight. Score: 90%",
        status: "Excellent"
      },
      {
        question: "Explain the difference between Symmetric and Asymmetric encryption in secure socket layer handshakes.",
        candidateAnswer: "Symmetric uses the same key for encryption and decryption, making it fast. Asymmetric uses a public key for encryption and a private key for decryption. In SSL, asymmetric is used for authentication and key exchange, then symmetric takes over for data transfer.",
        aiEvaluation: "Accurate distinction regarding key management workflows and computational efficiency tradeoffs. Well explained. Score: 85%",
        status: "Strong"
      },
      {
        question: "What is a Zero-Trust Network Architecture and how do you implement micro-segmentation within it?",
        candidateAnswer: "Zero-trust means never trust, always verify. You put internal firewalls everywhere so users cannot access everything if one node gets breached.",
        aiEvaluation: "Concept definition is correct, but technical implementation depth is lacking. Missing core concepts like Identity and Access Management (IAM), dynamic policy engines, and software-defined perimeters. Score: 60%",
        status: "Needs Improvement"
      }
    ]
  });

  return (
    <div className="min-h-screen w-full bg-slate-50 text-slate-800 font-sans p-6 md:p-10 selection:bg-blue-100 selection:text-blue-900">
      
      {/* GLOBAL TOP NAVIGATION NAVIGATION CONTROL */}
      <div className="max-w-4xl mx-auto flex justify-between items-center mb-8 border-b border-slate-200 pb-5">
        <div className="flex items-center gap-3">
          <div className="h-6 w-6 rounded-md bg-slate-900 flex items-center justify-center text-white text-xs font-bold">
            R
          </div>
          <div className="text-[11px] font-mono tracking-widest text-slate-400 uppercase font-bold">
            AI Analytics Engine / Session Report
          </div>
        </div>
        <button 
          onClick={() => navigate('/interview')}
          className="px-4 py-1.5 rounded-lg border border-slate-300 text-slate-600 text-xs font-bold bg-white hover:bg-slate-100 transition-all active:scale-95 cursor-pointer shadow-xs"
        >
          ← Back to Terminal Dashboard
        </button>
      </div>

      <main className="max-w-4xl mx-auto space-y-8 animate-fade-in">
        
        {/* 1. HERO RESULTS SUMMARY CARD */}
        <section className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 shadow-xs relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-[4px] bg-gradient-to-r from-blue-600 to-cyan-500"></div>
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono bg-blue-50 text-blue-600 px-2.5 py-0.5 rounded-md font-bold uppercase tracking-wider border border-blue-100">
                  {reportData.difficulty} Session Matrix
                </span>
                <span className="text-[10px] font-mono bg-emerald-50 text-emerald-600 px-2.5 py-0.5 rounded-md font-bold uppercase tracking-wider border border-emerald-100">
                  {reportData.status}
                </span>
              </div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">{reportData.jobProfile}</h1>
              <p className="text-xs text-slate-400 font-mono">Timestamp Hash: {reportData.date} // Verified Node</p>
            </div>

            {/* PERFORMANCE RADIAL CHIP BOX */}
            <div className="flex items-center gap-4 bg-slate-50 border border-slate-200/60 p-4 rounded-xl shrink-0 w-full sm:w-auto justify-between sm:justify-start shadow-inner">
              <div className="text-left sm:text-right">
                <div className="text-[10px] font-mono text-slate-400 uppercase tracking-tight font-bold">Overall Score Index</div>
                <div className="text-[11px] font-semibold text-slate-500">Benchmark: 70%</div>
              </div>
              <div className="text-2xl font-black text-blue-600 bg-white border border-blue-100 h-14 w-14 rounded-xl flex items-center justify-center shadow-sm shrink-0">
                {reportData.overallScore}%
              </div>
            </div>
          </div>

          {/* EXECUTIVE OVERVIEW */}
          <div className="mt-6 pt-6 border-t border-slate-100">
            <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold mb-2">Executive Summary Feedback</h4>
            <p className="text-sm text-slate-600 leading-relaxed font-serif italic bg-slate-50/50 p-4 rounded-xl border border-dashed border-slate-200">
              "{reportData.summary}"
            </p>
          </div>
        </section>

        {/* 2. SKILLS EVALUATION METRICS SLIDERS */}
        <section className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 shadow-xs space-y-4">
          <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold">Core Competency Performance</h3>
          <div className="grid grid-cols-1 gap-5">
            {reportData.metrics.map((metric, idx) => (
              <div key={idx} className="space-y-2">
                <div className="flex justify-between text-xs font-bold items-center">
                  <span className="text-slate-700">{metric.name}</span>
                  <span className={`font-mono px-2 py-0.5 rounded text-[11px] ${metric.lightColor}`}>{metric.score}%</span>
                </div>
                {/* Visual Line Progress Graph Track */}
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden shadow-inner">
                  <div 
                    className={`h-full ${metric.color} transition-all duration-700 ease-out rounded-full`} 
                    style={{ width: `${metric.score}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 3. QUESTION-BY-QUESTION DEEP AUDIT LAYER */}
        <section className="space-y-4">
          <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold px-1">
            Granular Transcript Deep Dive
          </h3>
          
          <div className="space-y-4">
            {reportData.detailedQA.map((item, idx) => (
              <div key={idx} className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4 transition-all hover:border-slate-300">
                
                {/* QUESTION STATUS HEADER */}
                <div className="flex justify-between items-start gap-4 border-b border-slate-100 pb-3">
                  <div className="flex gap-2">
                    <span className="text-xs font-mono font-bold text-blue-600 bg-blue-50 h-5 w-5 rounded flex items-center justify-center">
                      0{idx + 1}
                    </span>
                    <h4 className="text-sm font-bold text-slate-900 leading-snug">{item.question}</h4>
                  </div>
                  <span className={`text-[9px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded shrink-0 ${
                    item.status === 'Excellent' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                    item.status === 'Strong' ? 'bg-blue-50 text-blue-600 border border-blue-100' : 
                    'bg-amber-50 text-amber-600 border border-amber-100'
                  }`}>
                    {item.status}
                  </span>
                </div>

                {/* USER'S SUBMITTED RESPONSE */}
                <div className="space-y-1 pl-7">
                  <h5 className="text-[10px] font-mono uppercase text-slate-400 tracking-wider font-bold">Your Response Asset:</h5>
                  <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-100 font-mono leading-relaxed">
                    {item.candidateAnswer}
                  </p>
                </div>

                {/* AI TARGET EVALUATION INSIGHT */}
                <div className="space-y-1 pl-7">
                  <h5 className="text-[10px] font-mono uppercase text-blue-500 tracking-wider font-bold">AI Node Analytics Reflection:</h5>
                  <div className="text-xs text-slate-700 bg-blue-50/30 p-3 rounded-lg border border-blue-100/60 leading-relaxed flex items-start gap-2">
                    <span className="text-sm mt-0.5">💡</span>
                    <p>{item.aiEvaluation}</p>
                  </div>
                </div>

              </div>
            ))}
          </div>
        </section>

        {/* PRINT TRANSCRIPT ACTION MODULE */}
        <div className="pt-4 flex justify-end">
          <button 
            onClick={() => window.print()}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs tracking-wider uppercase transition-all active:scale-95 shadow-md shadow-slate-900/10 cursor-pointer text-center"
          >
            Download Formal Audit Transcript (PDF)
          </button>
        </div>

      </main>
    </div>
  );
};

export default Report;