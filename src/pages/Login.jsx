import { useState } from "react";
import BrandAnimation from "../components/BrandAnimation";

const Login = () => {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const emailError = submitted && !email;
  const passError = submitted && !pass;

  const handleSubmit = () => {
    setSubmitted(true);

    if (!email || !pass) return;

    // later connect to backend
    console.log("Login Successful!");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100vw",
        background: "linear-gradient(135deg, #ffffff 0%, #f4f6fb 100%)",
        display: "flex",
        alignItems: "center",
        position: "relative",
        overflow: "hidden",
        paddingRight: "8vw",
      }}
    >
      {/* LEFT BRAND SECTION */}
      <div
        style={{
          position: "absolute",
          left: "6vw",
          top: "50%",
          transform: "translateY(-50%)",
          width: "75%",
          zIndex: 3,
        }}
      >
        <BrandAnimation />
      </div>

      {/* DESCRIPTION TEXT */}
      <div
        style={{
          position: "absolute",
          left: "3vw",
          top: "78%",
          width: "36%",
          fontSize: "17px",
          lineHeight: "28px",
          opacity: 0.85,
          color: "#5a5a5a",
          animation: "fadeUp 1.4s ease forwards",
        }}
      >
        MailCaller intelligently scans your inbox, detects important events,
        and alerts you before they happen. Stay organized, stay on time —
        automatically.
      </div>

      {/* RIGHT LOGIN CARD */}
      <div
        style={{
          width: "400px",
          background: "rgba(255, 255, 255, 0.55)",
          padding: "38px 40px",
          borderRadius: "22px",
          boxShadow: "0 18px 45px rgba(0,0,0,0.12)",
          backdropFilter: "blur(20px)",
          marginLeft: "auto",
          marginRight: "6vw",
          zIndex: 5,
          animation: "slideIn 1.1s ease forwards",
        }}
      >
        {/* Heading */}
        <h1
          style={{
            fontFamily: "'verdana', cursive",
            fontSize: "32px",
            fontWeight: 700,
            color: "#222",
            marginBottom: "0px",
            marginTop: "0px",
          }}
        >
          Scan.Alert.Attend.
        </h1>

        <p
          style={{
            opacity: 0.7,
            marginBottom: "25px",
            fontSize: "16px",
            color: "#555",
          }}
        >
          Smart, next-generation scheduling intelligence.
        </p>

        {/* EMAIL INPUT */}
        <input
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{
            fontFamily: "'sans-serif','Arial'",
            fontSize: "16px", 
            width: "100%",
            padding: "15px",
            borderRadius: "12px",
            border: emailError
              ? "1px solid #ff4d4d"
              : "1px solid rgba(0,0,0,0.2)",
            marginBottom: "10px",
          }}
        />

        {emailError && (
          <div style={{ color: "#ff4d4d", fontFamily: "'sans-serif','Arial'",
            fontSize: "16px", fontWeight: 500, marginBottom: "10px" }}>
            ⚠ Please fill out this field
          </div>
        )}

        {/* PASSWORD INPUT */}
        <input
          type="password"
          placeholder="Password"
          value={pass}
          onChange={(e) => setPass(e.target.value)}
          style={{
            fontFamily: "'sans-serif','Arial'",
            fontSize: "16px",
            width: "100%",
            padding: "15px",
            borderRadius: "12px",
            border: passError
              ? "1px solid #ff4d4d"
              : "1px solid rgba(0,0,0,0.2)",
            marginBottom: "20px",
          }}
        />

        {/* LOGIN BUTTON */}
        <button
          onClick={handleSubmit}
          style={{
            fontFamily: "'sans-serif','Arial'",
            fontSize: "16px",
            width: "100%",
            padding: "15px",
            background: "#000",
            color: "white",
            borderRadius: "12px",
            fontWeight: "600",
            cursor: "pointer",
            marginBottom: "22px",
            letterSpacing: "0.5px",
            transition: "0.25s",
          }}
          onMouseEnter={(e) => (e.target.style.transform = "scale(1.02)")}
          onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
        >
          Log In
        </button>

        {/* Divider */}
        <div
          style={{
            
            textAlign: "center",
            opacity: 0.5,
            marginBottom: "20px",
            fontSize: "16px",
            fontWeight: 500,
          }}
        >
          OR
        </div>

        {/* GOOGLE BUTTON */}
        <button
          style={{
            width: "100%",
            padding: "15px",
            borderRadius: "12px",
            background: "#f7f7f7",
            border: "1px solid rgba(0,0,0,0.1)",
            fontFamily: "'sans-serif','Arial'",
            fontSize: "16px",
            fontWeight: 500,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px",
            cursor: "pointer",
          }}
        >
          {/* GOOGLE SVG LOGO */}
          <svg width="20" height="20" viewBox="0 0 488 512">
            <path
              fill="#EA4335"
              d="M488 261.8c0-17.4-1.5-34.1-4.3-50.2H249v95h135.9c-5.9 31.6-23.5 58.4-50.3 76.2l81.2 63.1C456.1 397.7 488 334.4 488 261.8z"
            />
            <path
              fill="#34A853"
              d="M249 492c67.7 0 124.6-22.5 166.1-61.1l-81.2-63.1c-22.5 15.2-51.1 24.2-84.9 24.2-65.3 0-120.7-44.1-140.3-103.4H25.1v64.9C66.1 438.3 150.3 492 249 492z"
            />
            <path
              fill="#4A90E2"
              d="M108.7 288.6c-4.8-14.4-7.5-29.7-7.5-45.3s2.7-30.9 7.5-45.3v-64.9H25.1C9 183.5 0 221.4 0 261.8s9 78.3 25.1 112.4l83.6-64.9z"
            />
            <path
              fill="#FBBC05"
              d="M249 101.4c36.8 0 69.9 12.7 96 37.7l71.7-71.7C373.6 23.2 316.7 0 249 0 150.3 0 66.1 53.7 25.1 139.4l83.6 64.9C128.3 145.5 183.7 101.4 249 101.4z"
            />
          </svg>

          Continue with Google
        </button>

        {/* SIGNUP LINK */}
        <div
          style={{
            marginTop: "25px",
            fontSize: "15px",
            color: "#444",
            textAlign: "center",
            fontFamily: "'sans-serif','Arial'",
            fontSize: "16px",
          }}
        >
          Don’t have an account?
          <a
            href="/signup"
            style={{
              color: "#0077ff",
              marginLeft: "6px",
              fontWeight: 600,
              textDecoration: "none",
              fontFamily: "'sans-serif','Arial'",
            fontSize: "16px",
            }}
          >
            Sign Up
          </a>
        </div>
      </div>

      {/* ANIMATIONS */}
      <style>
        {`
          @keyframes slideIn {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
          }

          @keyframes fadeUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>
    </div>
  );
};

export default Login;
