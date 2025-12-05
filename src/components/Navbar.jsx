import React from "react";
import { FiBell } from "react-icons/fi";

const Navbar = () => {
  // Greeting Logic
  const hours = new Date().getHours();
  let greeting = "Welcome Back";

  if (hours < 12) greeting = "Good Morning";
  else if (hours < 17) greeting = "Good Afternoon";
  else greeting = "Good Evening";

  // Username from localStorage (fallback = Pradeep)
  const userName = localStorage.getItem("userName") || "Pradeep";

  return (
    <div
      style={{
        width: "100%",
        height: "70px",
        background: "#ffffff",
        borderBottom: "1px solid #e6eaf0",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 24px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
        position: "sticky",
        top: 0,
        zIndex: 10,
        fontFamily: "Poppins",
      }}
    >
      {/* LEFT LOGO */}
      
      <div style={{fontFamily: "Poppins",fontSize: "22px", fontWeight: 600, color: "#0b2545" }}> MΛIL CΛLLER </div>

      {/* RIGHT SECTION */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "18px",
        }}
      >
        {/* Notification Bell */}
        <div
          style={{
            fontSize: "22px",
            color: "#0b2545",
            cursor: "pointer",
            transition: "0.2s",
          }}
          onMouseEnter={(e) => (e.target.style.opacity = 0.6)}
          onMouseLeave={(e) => (e.target.style.opacity = 1)}
        >
          <FiBell />
        </div>

        {/* Greeting with fade animation */}
        <div
          style={{
            color: "#0b2545",
            fontSize: "16px",
            fontWeight: 500,
            animation: "fadeIn 0.8s ease",
            whiteSpace: "nowrap",
          }}
        >
          {greeting}, <strong>{userName}!</strong>
        </div>

        {/* Avatar */}
        <div
          style={{
            width: "42px",
            height: "42px",
            borderRadius: "50%",
            background: "linear-gradient(180deg,#dce7ff,#b5c9ff)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#0b2545",
            fontWeight: 700,
            fontSize: "15px",
            boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
            cursor: "pointer",
          }}
        >
          {userName.charAt(0).toUpperCase()}
        </div>
      </div>

      {/* Fade Animation */}
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-3px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>
    </div>
  );
};

export default Navbar;
