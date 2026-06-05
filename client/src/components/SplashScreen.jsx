import React, { useState, useEffect } from 'react';

const SplashScreen = ({ onFinished }) => {
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowPrompt(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      onClick={onFinished}
      className="fixed inset-0 w-screen h-screen overflow-hidden flex flex-col items-center justify-center use-app-bg font-sans cursor-pointer select-none z-[9999]"
    >
      {/* Background Image */}
      <img
        src="/splash-bg.png"
        alt="Interview Coach Background"
        className="absolute top-0 left-0 w-full h-full object-cover pointer-events-none z-0"
      />

      {/* Overlays */}
      <div
        className="absolute inset-0 z-10"
        style={{
          background:
            'linear-gradient(to bottom, rgba(10,12,18,0.9), rgba(10,12,18,0.6), rgba(10,12,18,0.9))',
        }}
      />

      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:35px_35px] pointer-events-none z-20" />

      {/* Content Card */}
      <div className="relative z-30 text-center max-w-md w-[90%] px-8 py-14 rounded-2xl use-card-bg backdrop-blur-md border border-accent/40 shadow-[0_0_50px_rgba(59,130,246,0.15)] transition-all duration-500">
     
        <h1 className="mt-6 text-4xl font-black tracking-tight text-app uppercase sm:text-5xl">
          INTERVIEW{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400 drop-shadow-[0_0_15px_rgba(56,189,248,0.3)]">
            COACH
          </span>
        </h1>

        <p className="mt-3 text-xs tracking-wide text-muted max-w-xs mx-auto font-medium">
          Intelligent real-time simulator powered by advanced AI logic.
        </p>

        <div className="mt-12 h-6 flex items-center justify-center">
          {showPrompt ? (
            <p className="text-xs font-mono tracking-[0.2em] text-cyan-400 animate-pulse uppercase">[ Click Anywhere to Continue ]</p>
          ) : (
            <div className="w-5 h-5 border-2 border-t-transparent border-blue-400 rounded-full animate-spin" />
          )}
        </div>

        <div className="mt-10 text-[9px] font-mono text-muted tracking-widest uppercase">Local Security Context: Active</div>
      </div>
    </div>
  );
};

export default SplashScreen;