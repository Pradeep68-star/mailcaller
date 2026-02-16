import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  FiMail,
  FiPhone,
  FiClock,
  FiSearch,
  FiPhoneCall,
} from "react-icons/fi";

const theme = {
  primary: "#0b2545",
  muted: "#6b7280",
  cardBg: "#ffffff",
  shadow: "0 8px 20px rgba(0,0,0,0.06)",
  blue: "#0b2545",
  green: "#0d8f2a",
  red: "#8b0000",
};

const defaultKeywords = [
  "meeting",
  "schedule",
  "event",
  "hackathon",
  "contest",
  "interview",
  "reminder",
  "call",
  "appointment",
  "conference",
];

const Settings = () => {
  // ---------------- STATES ----------------
  const [gmail, setGmail] = useState("");
  const [connectedGmail, setConnectedGmail] = useState(null);
  const [loadingGmail, setLoadingGmail] = useState(false);

  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");

  const [interval, setInterval] = useState("5");

  const [userKeywords, setUserKeywords] = useState(() => {
    const saved = localStorage.getItem("userKeywords");
    return saved ? JSON.parse(saved) : [];
  });
  const [newKeyword, setNewKeyword] = useState("");

  // ---------------- GMAIL STATUS ----------------
  const fetchGmailStatus = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/google/status", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.connected) setConnectedGmail(res.data.gmail);
      else setConnectedGmail(null);
    } catch (err) {
      console.error("Gmail status error", err);
    }
  };

  useEffect(() => {
    fetchGmailStatus();
  }, []);

  // ---------------- GMAIL ACTIONS ----------------
  const handleConnectGmail = () => {
    if (!gmail) return alert("Please enter Gmail");
    window.location.href = `http://localhost:5000/api/google/connect?expectedGmail=${encodeURIComponent(
      gmail
    )}`;
  };

  const handleDisconnectGmail = async () => {
    try {
      setLoadingGmail(true);
      const token = localStorage.getItem("token");

      await axios.post(
        "http://localhost:5000/api/google/disconnect",
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setConnectedGmail(null);
      alert("Gmail disconnected");
    } catch {
      alert("Failed to disconnect Gmail");
    } finally {
      setLoadingGmail(false);
    }
  };

  // ---------------- KEYWORDS ----------------
  const addKeyword = () => {
    if (!newKeyword.trim()) return;
    if (userKeywords.includes(newKeyword.toLowerCase()))
      return alert("Keyword already exists");

    const updated = [...userKeywords, newKeyword.toLowerCase()];
    setUserKeywords(updated);
    localStorage.setItem("userKeywords", JSON.stringify(updated));
    setNewKeyword("");
  };

  const deleteKeyword = (k) => {
    const updated = userKeywords.filter((x) => x !== k);
    setUserKeywords(updated);
    localStorage.setItem("userKeywords", JSON.stringify(updated));
  };

  // ---------------- UI ----------------
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
      <h2 style={{ fontSize: 26, fontWeight: 600 }}>Settings</h2>
      <p style={{ color: theme.muted }}>
        Connect your account & customize call reminders.
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: 26 }}>
        {/* ---------------- Gmail ---------------- */}
        <Card title="Gmail for MailCaller" icon={<FiMail />}>
          {!connectedGmail ? (
            <>
              <p style={{ color: theme.muted, fontSize: 14 }}>
                Read-only access • No email sending • Revoke anytime
              </p>
              <Input
                placeholder="example@gmail.com"
                value={gmail}
                onChange={(e) => setGmail(e.target.value)}
              />
              <Row>
                <Button onClick={() => alert("Saved")}>Save Gmail</Button>
                <Button dark onClick={handleConnectGmail}>
                  Connect Gmail Account
                </Button>
              </Row>
            </>
          ) : (
            <>
              <p>✔ Connected: <strong>{connectedGmail}</strong></p>
              <Button red onClick={handleDisconnectGmail}>
                {loadingGmail ? "Disconnecting..." : "Disconnect Gmail"}
              </Button>
            </>
          )}
        </Card>

        {/* ---------------- Phone ---------------- */}
        <Card title="Your Phone Number" icon={<FiPhone />}>
          <Input
            placeholder="+91XXXXXXXXXX"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <Row>
            <Button>Save Phone</Button>
            <Button>Send OTP</Button>
            <Input
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
            <Button green>Verify</Button>
          </Row>
        </Card>

        {/* ---------------- Event Detection ---------------- */}
        <Card title="Event Detection" icon={<FiClock />}>
          <Input
            placeholder="Scan every X minutes"
            value={interval}
            onChange={(e) => setInterval(e.target.value)}
          />
          <Button>Update Interval</Button>
        </Card>

        {/* ---------------- Test Call ---------------- */}
        <Card title="Test Call" icon={<FiPhoneCall />}>
          <p style={{ color: theme.muted }}>
            Make a test call to verify reminders.
          </p>
          <Button green>Make Test Call</Button>
        </Card>

        {/* ---------------- Keywords ---------------- */}
        <Card title="Event Keywords" icon={<FiSearch />}>
          <div>
            {defaultKeywords.map((k) => (
              <Chip key={k}>{k}</Chip>
            ))}
          </div>

          <div style={{ marginTop: 12 }}>
            {userKeywords.map((k) => (
              <Chip key={k} removable onClick={() => deleteKeyword(k)}>
                {k}
              </Chip>
            ))}
          </div>

          <Row>
            <Input
              placeholder="Add keyword"
              value={newKeyword}
              onChange={(e) => setNewKeyword(e.target.value)}
            />
            <Button onClick={addKeyword}>Add</Button>
          </Row>
        </Card>
      </div>
    </div>
  );
};

/* ---------------- SMALL UI COMPONENTS ---------------- */

const Card = ({ title, icon, children }) => (
  <div
    style={{
      background: "#fff",
      borderRadius: 16,
      padding: 22,
      boxShadow: theme.shadow,
    }}
  >
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      {icon}
      <h3 style={{ margin: 0 }}>{title}</h3>
    </div>
    <div style={{ marginTop: 12 }}>{children}</div>
  </div>
);

const Button = ({ children, onClick, green, red, dark }) => (
  <button
    onClick={onClick}
    style={{
      padding: "10px 18px",
      borderRadius: 14,
      border: "none",
      cursor: "pointer",
      background: green
        ? theme.green
        : red
        ? theme.red
        : dark
        ? "#102f5f"
        : theme.blue,
      color: "#fff",
    }}
  >
    {children}
  </button>
);

const Input = (props) => (
  <input
    {...props}
    style={{
      padding: 12,
      borderRadius: 12,
      border: "1px solid #ccc",
      width: "100%",
      maxWidth: 280,
    }}
  />
);

const Row = ({ children }) => (
  <div style={{ display: "flex", gap: 10, marginTop: 12, flexWrap: "wrap" }}>
    {children}
  </div>
);

const Chip = ({ children, removable, onClick }) => (
  <span
    onClick={onClick}
    style={{
      display: "inline-block",
      padding: "6px 14px",
      borderRadius: 20,
      background: "#eef2ff",
      marginRight: 8,
      marginBottom: 8,
      cursor: removable ? "pointer" : "default",
      fontSize: 13,
    }}
  >
    {children} {removable && "×"}
  </span>
);

export default Settings;