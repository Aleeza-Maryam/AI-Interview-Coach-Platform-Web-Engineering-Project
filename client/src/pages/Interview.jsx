import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const Interview = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { role, level } = location.state || {};

  useEffect(() => {
    if (!role || !level) {
      navigate("/");
      return;
    }
    navigate("/interview-session", {
      state: { role, level }
    });
  }, [role, level, navigate]);

  return (
    <div className="min-h-screen bg-[#0b0f19] text-white flex items-center justify-center">
      <div className="text-center space-y-3">
        <div className="mx-auto h-14 w-14 rounded-full border-4 border-blue-500 border-t-transparent animate-spin"></div>
        <p className="text-sm text-slate-300">Initializing interview session...</p>
      </div>
    </div>
  );
};

export default Interview;
