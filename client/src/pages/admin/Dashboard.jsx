import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../../context/AppContext";

const Dashboard = () => {
  const { token } = useAppContext();
  const navigate = useNavigate();

  // Time left state initialized from loginTime in localStorage
  const [timeLeft, setTimeLeft] = useState(() => {
    const loginTime = localStorage.getItem("loginTime");
    if (!loginTime) return 0;
    const elapsed = Math.floor((Date.now() - Number(loginTime)) / 1000);
    return Math.max(0, 5 * 3600 - elapsed); // 5 hours in seconds
  });

  useEffect(() => {
    if (timeLeft <= 0) {
      localStorage.removeItem("token");
      localStorage.removeItem("loginTime");
      navigate("/admin/login");
    }

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft, navigate]);

  // Format seconds to HH:MM:SS
  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, "0")}:${m
      .toString()
      .padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  // Determine timer color based on remaining time
  const getTimerColor = () => {
    if (timeLeft > 14400) return "#51ff00"; // green > 4h
    if (timeLeft > 10800) return "#27e17f"; // green-light 4h-3h
    if (timeLeft > 7200) return "#fffb00"; // yello 3h-2h
    if (timeLeft >3600) return "#f6b000";  // orange-light 1h
    if (timeLeft >1800) return "#ff5100";  // orange 30-60 min
    return "#ff0000";                      // red < 20 min
  };

  return (
    <div className="dashboard-screen-wrapper">
      <div className="dashboard-container">
        <h1 className="dashboard-welcome-text">Welcome to Admin Panel</h1>

        <p className="timer-label">Session expires in</p>

        <div className="timer-circle-outer">
          <div className="timer-wave" />
          <div
            className="timer-circle-inner"
            style={{ color: getTimerColor() }}
          >
            {formatTime(timeLeft)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
