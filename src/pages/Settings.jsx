// src/pages/Settings.jsx
import React, { useState } from "react";
import {
  FiMail,
  FiPhone,
  FiShield,
  FiClock,
  FiSearch ,
  FiPhoneCall
} from "react-icons/fi";

const theme = {
  primary: "#0b2545",
  muted: "#6b7280",
  cardBg: "#ffffff",
  shadow: "0 8px 20px rgba(0,0,0,0.06)",
  blue: "#0b2545",
  green: "#0d8f2a",
};

// ---------------- DEFAULT KEYWORDS ----------------
const defaultKeywords = [
  "meeting", "schedule", "event", "hackathon", "contest",
  "interview", "reminder", "call", "appointment", "conference"
];

const Settings = () => {
  const [gmail, setGmail] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");

  // KEYWORDS STATES
  const [userKeywords, setUserKeywords] = useState(() => {
    const saved = localStorage.getItem("userKeywords");
    return saved ? JSON.parse(saved) : [];
  });
  const [newKeyword, setNewKeyword] = useState("");

  // Add custom keyword
  const addKeyword = () => {
    if (!newKeyword.trim()) return;
    if (userKeywords.includes(newKeyword.toLowerCase()))
      return alert("Keyword already exists!");

    const updated = [...userKeywords, newKeyword.toLowerCase()];
    setUserKeywords(updated);
    localStorage.setItem("userKeywords", JSON.stringify(updated));
    setNewKeyword("");
  };

  // Delete custom keyword
  const deleteKeyword = (word) => {
    const updated = userKeywords.filter(k => k !== word);
    setUserKeywords(updated);
    localStorage.setItem("userKeywords", JSON.stringify(updated));
  };

  return (
    <div
      style={{
        padding: 30,
        fontFamily: "'Poppins', sans-serif",
        background: "#f6f8fb",
        minHeight: "100vh",
        color: theme.primary,
      }}
    >
      {/* HEADER */}
      <h2 style={{ fontSize: 26, fontWeight: 600, marginBottom: 4 }}>Settings</h2>
      <p style={{ color: theme.muted, fontSize: 14 }}>
        Connect your account & customize call reminders.
      </p>

      {/* CARDS CONTAINER */}
      <div style={{ display: "flex", flexDirection: "column", gap: 28, marginTop: 28 }}>

        {/* ----------------------- 1️⃣ Gmail Section ----------------------- */}
        <div style={{
          background: theme.cardBg,
          borderRadius: 16,
          padding: 22,
          boxShadow: theme.shadow,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <FiMail size={20} color={theme.primary} />
            <div style={{ fontSize: 18, fontWeight: 600 }}>Gmail for MailCaller</div>
          </div>

          <p style={{ color: theme.muted, fontSize: 14 }}>
            Enter the Gmail account MailCaller will scan.
          </p>

          <input
            type="email"
            placeholder="example@gmail.com"
            value={gmail}
            onChange={(e) => setGmail(e.target.value)}
            style={{
              width: "100%",
              padding: "12px 14px",
              borderRadius: 12,
              border: "1px solid rgba(0,0,0,0.15)",
              marginTop: 8,
              fontSize: 14,
            }}
          />

          <div style={{ display: "flex", gap: 12, marginTop: 14 }}>
            <button style={{
              padding: "10px 18px",
              borderRadius: 14,
              background: theme.blue,
              color: "#fff",
              border: "1px solid " + theme.blue,
              cursor: "pointer",
              fontSize: 14,
              fontWeight: 500,
            }}>
              Save Gmail
            </button>

            <button style={{
              padding: "10px 18px",
              borderRadius: 14,
              background: "#102f5f",
              color: "#fff",
              border: "1px solid #102f5f",
              cursor: "pointer",
              fontSize: 14,
              fontWeight: 500,
            }}>
              Connect Gmail Account
            </button>
          </div>
        </div>

        {/* ----------------------- 2️⃣ Phone Section ----------------------- */}
        <div style={{
          background: theme.cardBg,
          borderRadius: 16,
          padding: 22,
          boxShadow: theme.shadow,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <FiPhone size={20} color={theme.primary} />
            <div style={{ fontSize: 18, fontWeight: 600 }}>Your Phone Number</div>
          </div>

          <input
            type="text"
            placeholder="+91XXXXXXXXXX"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            style={{
              width: "100%",
              padding: "12px 14px",
              borderRadius: 12,
              border: "1px solid rgba(0,0,0,0.15)",
              marginTop: 8,
              fontSize: 14,
            }}
          />

          <button style={{
            marginTop: 14,
            padding: "10px 18px",
            borderRadius: 14,
            background: theme.blue,
            color: "#fff",
            border: "1px solid " + theme.blue,
            cursor: "pointer",
            fontSize: 14,
            fontWeight: 500,
          }}>
            Save Phone Number
          </button>

          {/* OTP ROW */}
          <div style={{ marginTop: 18, display: "flex", gap: 12 }}>
            <button style={{
              padding: "10px 18px",
              borderRadius: 14,
              background: "#0c325f",
              color: "#fff",
              border: "1px solid #0c325f",
              cursor: "pointer",
              fontSize: 14,
              fontWeight: 500,
            }}>
              <FiShield size={16} style={{ marginRight: 6 }} />
              Send OTP
            </button>

            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              style={{
                flex: 1,
                padding: "10px 14px",
                borderRadius: 12,
                border: "1px solid rgba(0,0,0,0.2)",
                fontSize: 14,
              }}
            />

            <button style={{
              padding: "10px 18px",
              borderRadius: 14,
              background: theme.green,
              color: "#fff",
              border: "1px solid " + theme.green,
              cursor: "pointer",
              fontSize: 14,
              fontWeight: 500,
            }}>
              Verify
            </button>
          </div>
        </div>

        {/* ----------------------- 3️⃣ Event Detection Interval ----------------------- */}
        <div style={{
          background: theme.cardBg,
          borderRadius: 16,
          padding: 22,
          boxShadow: theme.shadow,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <FiClock size={20} color={theme.primary} />
            <div style={{ fontSize: 18, fontWeight: 600 }}>Event Detection</div>
          </div>

          <input
            type="number"
            placeholder="Scan every X minutes"
            style={{
              width: "100%",
              padding: "12px 14px",
              borderRadius: 12,
              border: "1px solid rgba(0,0,0,0.15)",
              fontSize: 14,
              marginTop: 8,
            }}
          />

          <button style={{
            marginTop: 14,
            padding: "10px 18px",
            borderRadius: 14,
            background: theme.blue,
            color: "#fff",
            border: "1px solid " + theme.blue,
            cursor: "pointer",
            fontSize: 14,
            fontWeight: 500,
          }}>
            Update Interval
          </button>
        </div>

        {/* ----------------------- 4️⃣ Test Call ----------------------- */}
        <div style={{
          background: theme.cardBg,
          borderRadius: 16,
          padding: 22,
          boxShadow: theme.shadow,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <FiPhoneCall size={20} color={theme.primary} />
            <div style={{ fontSize: 18, fontWeight: 600 }}>Test Call</div>
          </div>

          <p style={{ color: theme.muted, fontSize: 14 }}>
            Make a test call to verify reminders.
          </p>

          <button style={{
            marginTop: 10,
            padding: "10px 18px",
            borderRadius: 14,
            background: theme.green,
            color: "#fff",
            border: "1px solid " + theme.green,
            cursor: "pointer",
            fontSize: 14,
            fontWeight: 500,
          }}>
            Make Test Call
          </button>
        </div>

        {/* ----------------------- 5️⃣ EVENT KEYWORDS SECTION ----------------------- */}
        <div style={{
          background: "#fff",
          borderRadius: 16,
          padding: 22,
          boxShadow: theme.shadow,
        }}>
          
          <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 6 }}>
            <FiSearch size={20} color={theme.primary} /> Event Keywords
          </div>
          <p style={{ color: theme.muted, fontSize: 14 }}>
            These keywords help MailCaller detect event-related emails.
          </p>

          {/* DEFAULT KEYWORDS */}
          <div style={{ marginTop: 10, fontWeight: 600 }}>Default Keywords:</div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 6 }}>
            {defaultKeywords.map((k) => (
              <span key={k} style={{
                padding: "6px 10px",
                background: "#eef2ff",
                borderRadius: 8,
                fontSize: 13,
                color: "#0b2545",
              }}>
                {k}
              </span>
            ))}
          </div>

          {/* USER KEYWORDS */}
          <div style={{ marginTop: 20, fontWeight: 600 }}>Your Keywords:</div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 6 }}>
            {userKeywords.length === 0 && (
              <p style={{ color: theme.muted }}>No custom keywords added yet.</p>
            )}

            {userKeywords.map((k) => (
              <span key={k} style={{
                padding: "6px 10px",
                background: "#d1fae5",
                borderRadius: 8,
                fontSize: 13,
                color: "#065f46",
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}>
                {k}
                <span
                  onClick={() => deleteKeyword(k)}
                  style={{ cursor: "pointer", fontWeight: 900 }}
                >
                  ×
                </span>
              </span>
            ))}
          </div>

          {/* INPUT + ADD BUTTON */}
          <div style={{ display: "flex", gap: 12, marginTop: 18 }}>
            <input
              type="text"
              placeholder="Add keyword..."
              value={newKeyword}
              onChange={(e) => setNewKeyword(e.target.value)}
              style={{
                flex: 1,
                padding: "10px 14px",
                borderRadius: 12,
                border: "1px solid #ccc",
                fontSize: 14,
              }}
            />
            <button
              onClick={addKeyword}
              style={{
                padding: "10px 18px",
                borderRadius: 12,
                background: theme.blue,
                color: "#fff",
                cursor: "pointer",
                border: "none",
                fontWeight: 500,
              }}
            >
              Add
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Settings;
