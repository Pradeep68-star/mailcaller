import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  FiMail,
  FiPhone,
  FiClock,
  FiSearch,
} from "react-icons/fi";

const API = "http://localhost:5000/api";

const theme = {
  blue: "#0b2545",
  shadow: "0 8px 20px rgba(0,0,0,0.06)",
};

const Settings = () => {
  const token = localStorage.getItem("token");

  const [connectedGmail, setConnectedGmail] = useState(null);

  const [phone, setPhone] = useState("");
  const [interval, setInterval] = useState(5);
  const [keywords, setKeywords] = useState([]);
  const [newKeyword, setNewKeyword] = useState("");
  const [gmailInput, setGmailInput] = useState("");

  // ---------------- FETCH USER ----------------
  const fetchUserSettings = async () => {
    try {
      const res = await axios.get(`${API}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const user = res.data.user;

      setPhone(user.phoneNumber || "");
      setInterval(user.scanInterval || 5);
      setKeywords(user.keywords || []);
    } catch (err) {
      console.error("Failed to fetch settings", err);
    }
  };

  // ---------------- GMAIL STATUS ----------------
  const fetchGmailStatus = async () => {
    try {
      const res = await axios.get(`${API}/google/status`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setConnectedGmail(res.data.connected ? res.data.gmail : null);
    } catch (err) {
      console.error("Gmail status error", err);
    }
  };

  useEffect(() => {
    fetchUserSettings();
    fetchGmailStatus();
  }, []);

  // ---------------- SAVE PHONE ----------------
  const savePhone = async () => {
    try {
      await axios.put(
        `${API}/user/phone`,
        { phoneNumber: phone },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Phone updated successfully");
    } catch {
      alert("Failed to update phone");
    }
  };

  // ---------------- UPDATE INTERVAL ----------------
  const updateInterval = async () => {
    try {
      await axios.put(
        `${API}/user/interval`,
        { scanInterval: interval },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Interval updated");
    } catch {
      alert("Failed to update interval");
    }
  };

  // ---------------- ADD KEYWORD ----------------
  const addKeyword = async () => {
  if (!newKeyword.trim()) return;

  try {
    const res = await axios.put(
      `${API}/user/keywords`,
      { keyword: newKeyword.toLowerCase() },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setKeywords(res.data.user.keywords);
    setNewKeyword("");

  } catch (err) {
    console.error(err);
    alert("Failed to add keyword");
  }
};

  // ---------------- DELETE KEYWORD ----------------
  const deleteKeyword = async (k) => {
  try {
    const res = await axios.put(
      `${API}/user/keywords/remove`,
      { keyword: k },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setKeywords(res.data.user.keywords);

  } catch (err) {
    console.error(err);
    alert("Failed to remove keyword");
  }
};

  // ---------------- CONNECT GMAIL ----------------
  const connectGmail = () => {
    if (!userEmail) {
      alert("User email not loaded yet");
      return;
    }

    window.location.href = `${API}/google/connect?expectedGmail=${userEmail}`;
  };

  // ---------------- DISCONNECT GMAIL ----------------
  const disconnectGmail = async () => {
    try {
      await axios.post(
        `${API}/google/disconnect`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setConnectedGmail(null);
    } catch {
      alert("Failed to disconnect Gmail");
    }
  };

  return (
    <div
      style={{
        padding: 30,
        background: "#f6f8fb",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div style={{ width: "100%", maxWidth: "900px" }}>
        <h2>Settings</h2>

        {/* ---------------- GMAIL CONNECT ---------------- */}
        <Card title="Gmail Connection" icon={<FiMail />}>
  {connectedGmail ? (
    <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
      <span style={{ color: "green", fontWeight: 500 }}>
        ✅ Connected: {connectedGmail}
      </span>

      <Button onClick={disconnectGmail}>Disconnect</Button>
    </div>
  ) : (
    <div>
      <Input
        placeholder="Enter Gmail to connect"
        value={gmailInput}
        onChange={(e) => setGmailInput(e.target.value)}
      />

      <Button
  onClick={() => {
    if (!gmailInput) {
      alert("Enter Gmail first");
      return;
    }

    const token = localStorage.getItem("token");

    window.location.href =
      `http://localhost:5000/api/google/connect?token=${token}&expectedGmail=${gmailInput}`;
  }}
>
  Connect Gmail
</Button>
    </div>
  )}
</Card>

        {/* ---------------- Phone ---------------- */}
        <Card title="Your Phone Number" icon={<FiPhone />}>
          <Row>
            <Input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91XXXXXXXXXX"
            />
            <Button onClick={savePhone}>Save</Button>
          </Row>
        </Card>

        {/* ---------------- Interval ---------------- */}
        <Card title="Event Detection Interval" icon={<FiClock />}>
          <Row>
            <Input
              value={interval}
              onChange={(e) => setInterval(e.target.value)}
            />
            <Button onClick={updateInterval}>Update</Button>
          </Row>
        </Card>

        {/* ---------------- Keywords ---------------- */}
        <Card title="Event Keywords" icon={<FiSearch />}>
  <div style={{ marginBottom: 10 }}>
    {keywords.map((k) => (
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
      onKeyDown={(e) => {
        if (e.key === "Enter"){
          e.preventDefault();
          addKeyword();

        } 
      }}
    />
    <Button onClick={addKeyword}>Add</Button>
  </Row>
</Card>
      </div>
    </div>
  );
};

/* ---------- UI COMPONENTS ---------- */

const Card = ({ title, icon, children }) => (
  <div
    style={{
      background: "#fff",
      padding: 24,
      marginBottom: 24,
      borderRadius: 14,
      boxShadow: "0 6px 18px rgba(0,0,0,0.05)",
    }}
  >
    <h3 style={{ display: "flex", gap: 10, marginBottom: 15 }}>
      {icon} {title}
    </h3>
    {children}
  </div>
);

const Button = ({ children, onClick }) => (
  <button
    onClick={onClick}
    style={{
      padding: "10px 16px",
      borderRadius: 10,
      border: "none",
      background: theme.blue,
      color: "#fff",
      cursor: "pointer",
      whiteSpace: "nowrap",
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
      borderRadius: 10,
      border: "1px solid #ddd",
      flex: 1,
    }}
  />
);

const Row = ({ children }) => (
  <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
    {children}
  </div>
);

const Chip = ({ children, removable, onClick }) => (
  <span
    onClick={onClick}
    style={{
      display: "inline-block",
      padding: "6px 12px",
      borderRadius: 20,
      background: "#eef2ff",
      marginRight: 8,
      marginBottom: 8,
      cursor: removable ? "pointer" : "default",
    }}
  >
    {children} {removable && "×"}
  </span>
);

export default Settings;