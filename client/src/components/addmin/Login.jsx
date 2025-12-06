import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../../context/AppContext";

const Login = () => {
  const { axios, setToken } = useAppContext();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [step, setStep] = useState(1); // 1 = Send OTP, 2 = Verify OTP
  const [otp, setOtp] = useState("");
  const [popup, setPopup] = useState(null);
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const timerRef = useRef(null);

  const [otpArray, setOtpArray] = useState(["", "", "", "", "", ""]);
  const otpRefs = useRef([]);



  const allowedEmails = [
    // "mdnaimulhossainnaim6246@gmail.com",
    "naimhossain7155@gmail.com",
    "tours.insignia@gmail.com"
  ];

  const showPopup = (msg, type = "info") => {
    setPopup({ msg, type });
    setTimeout(() => setPopup(null), 3000);
  };

  const startTimer = (duration = 240) => {
    setTimeLeft(duration);
    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleSendOtp = async () => {
    setLoading(true);

    if (!allowedEmails.includes(email.trim())) {
      showPopup("❌ Can't access this email", "error");
      setLoading(false);
      return;
    }

    try {
      const res = await axios.post("/admin/send-otp", { email });
      setStep(2);
      showPopup(res.data.message || "OTP sent to your email", "success");
      startTimer(240); // ৪ মিনিটের কাউন্টডাউন শুরু
    } catch (err) {
      showPopup(err.response?.data?.message || "Failed to send OTP", "error");
    }

    setLoading(false);
  };

  const handleVerifyOtp = async () => {
    setLoading(true);

    try {
      const res = await axios.post("/admin/verify-otp", { email, otp });

      setToken(res.data.token);

      localStorage.setItem("token", res.data.token);

      // ------------- লগইন সময় লোকালস্টোরেজে সংরক্ষণ -------------
      // ৫ ঘণ্টার auto logout এর জন্য এটা খুবই গুরুত্বপূর্ণ
      localStorage.setItem("loginTime", Date.now().toString());

      axios.defaults.headers.common["Authorization"] = `Bearer ${res.data.token}`;

      showPopup("Login successful!", "success");

      setTimeout(() => navigate("/admin"), 1000);
    } catch (err) {
      showPopup(err.response?.data?.message || "Invalid OTP", "error");
      setStep(1);
      setToken(null);
      localStorage.removeItem("token");
      localStorage.removeItem("loginTime");
      delete axios.defaults.headers.common["Authorization"];
    }

    setLoading(false);
  };

  const handleResendOtp = async () => {
    setLoading(true);

    try {
      const res = await axios.post("/admin/send-otp", { email });
      showPopup(res.data.message || "OTP resent", "success");
      startTimer(240); // আবার কাউন্টডাউন শুরু করো
    } catch (err) {
      showPopup(err.response?.data?.message || "Failed to resend OTP", "error");
    }

    setLoading(false);
  };

  const handleOtpChange = (e, index) => {
  const value = e.target.value;
  if (!/^\d?$/.test(value)) return;

  const newOtp = [...otpArray];
  newOtp[index] = value;
  setOtpArray(newOtp);

  if (value && index < 5) {
    otpRefs.current[index + 1]?.focus();
  }

  setOtp(newOtp.join(""));
};

const handleOtpKeyDown = (e, index) => {
  if (e.key === "Backspace" && !otpArray[index] && index > 0) {
    const newOtp = [...otpArray];
    newOtp[index - 1] = "";
    setOtpArray(newOtp);
    otpRefs.current[index - 1]?.focus();
  }
};

const handlePaste = (e) => {
  const paste = e.clipboardData.getData("text").trim();
  if (/^\d{6}$/.test(paste)) {
    const newOtp = paste.split("");
    setOtpArray(newOtp);
    newOtp.forEach((digit, idx) => {
      if (otpRefs.current[idx]) {
        otpRefs.current[idx].value = digit;
      }
    });
    setOtp(paste);
    otpRefs.current[5]?.focus();
    e.preventDefault();
  }
};


  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m < 10 ? "0" + m : m}:${s < 10 ? "0" + s : s}`;
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  return (
    <div className="admin-login-container">
      <div className="login-card animate-pop">

       <span className="login-bg-animate"></span>

        <div className="login-animation-one from-login-box login-box">
        <h2 className="login-animation-one content-delay-one">Admin Login</h2>

        <div className={` login-animation-one email-outer-div ${email ? "focus-or-filled" : ""}`}>
        
         <input
          className={`content-delay-two login-animation-one inter-email-content ${email ? "has-content" : ""}`}
          type="email"
          placeholder=" "
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={step === 2}
        />
        
        <label  className="login-animation-one content-delay-three email-input-indication" >Email </label>
         <i className="content-delay-three login-animation-one login-email-icon fa-solid fa-envelope"></i>
       
        </div>

        {step === 1 ? (
          <button className="content-delay-four login-animation-one" onClick={handleSendOtp} disabled={loading}>
            {loading ? "Sending..." : "Send OTP"}
          </button>
        ) : (
          <>
            <label className="login-animation-one otp-input-indication">Enter the 6-digit code</label>

           <div className="login-animation-one input-otp-div" onPaste={handlePaste}>
          {otpArray.map((value, index) => (
          <input
          key={index}
          type="text"
          maxLength={1}
          className={`login-animation-one input-otp-content ${value ? "has-content" : ""}`}
          value={value}
          onChange={(e) => handleOtpChange(e, index)}
          onKeyDown={(e) => handleOtpKeyDown(e, index)}
          ref={(el) => (otpRefs.current[index] = el)}
        />
  ))}
</div>


            <button onClick={handleVerifyOtp} disabled={loading}>
              {loading ? "Verifying..." : "Verify OTP"}
            </button>

            {timeLeft > 0 ? (
              <p className="otp-timer">OTP expires in: {formatTime(timeLeft)}</p>
            ) : (
              <p
                className="resend-button"
                onClick={handleResendOtp}
                disabled={loading}
              >
                <span className="resend-button-what" >Resend otp</span>?
              </p>
            )}
          </>
        )}
      </div>

      <div className="login-animation-two info-text info-bg">
        <h1 className="login-animation-two info-text-h">INSIGNIA</h1>
        <p className=" login-animation-two info-text-p">Tours & Travel</p>

        <p className="login-animation-two info-text-indication">Please enter your authorized email to continue login.</p>

      </div>

      </div>

      {popup && <div className={`popup ${popup.type} animate-popup`}>{popup.msg}</div>}
    </div>
  );
};

export default Login;
