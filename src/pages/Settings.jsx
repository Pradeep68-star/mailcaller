import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  FiMail,
  FiPhone,
  FiClock,
  FiSearch,
  FiPhoneCall,
} from "react-icons/fi";

const API = "http://localhost:5000/api";

const theme = {
  primary: "#0b2545",
  muted: "#6b7280",
  shadow: "0 8px 20px rgba(0,0,0,0.06)",
  blue: "#0b2545",
  green: "#0d8f2a",
  red: "#8b0000",
};

const Settings = () => {
  const token = localStorage.getItem("token");

  const [gmail, setGmail] = useState("");
  const [connectedGmail, setConnectedGmail] = useState(null);
  const [loadingGmail, setLoadingGmail] = useState(false);

  const [phone, setPhone] = useState("");
  const [interval, setInterval] = useState(5);
  const [keywords, setKeywords] = useState([]);
  const [newKeyword, setNewKeyword] = useState("");

  // ---------------- FETCH USER SETTINGS ----------------
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
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setKeywords(res.data.user.keywords);
      setNewKeyword("");
    } catch {
      alert("Failed to add keyword");
    }
  };

  // ---------------- DELETE KEYWORD ----------------
  const deleteKeyword = async (k) => {
    try {
      const res = await axios.put(
        `${API}/user/keywords/remove`,
        { keyword: k },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setKeywords(res.data.user.keywords);
    } catch {
      alert("Failed to remove keyword");
    }
  };

  return (
    <div style={{ padding: 30, background: "#f6f8fb", minHeight: "100vh" }}>
      <h2>Settings</h2>

      {/* ---------------- Phone ---------------- */}
      <Card title="Your Phone Number" icon={<FiPhone />}>
        <Input
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="+91XXXXXXXXXX"
        />
        <Button onClick={savePhone}>Save Phone</Button>
      </Card>

      {/* ---------------- Interval ---------------- */}
      <Card title="Event Detection" icon={<FiClock />}>
        <Input
          value={interval}
          onChange={(e) => setInterval(e.target.value)}
          placeholder="Scan every X minutes"
        />
        <Button onClick={updateInterval}>Update Interval</Button>
      </Card>

      {/* ---------------- Keywords ---------------- */}
      <Card title="Event Keywords" icon={<FiSearch />}>
        <div>
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
          />
          <Button onClick={addKeyword}>Add</Button>
        </Row>
      </Card>
    </div>
  );
};

/* ---------- UI Components ---------- */

const Card = ({ title, icon, children }) => (
  <div
    style={{
      background: "#fff",
      padding: 20,
      marginBottom: 20,
      borderRadius: 12,
      boxShadow: theme.shadow,
    }}
  >
    <h3>
      {icon} {title}
    </h3>
    {children}
  </div>
);

const Button = ({ children, onClick }) => (
  <button
    onClick={onClick}
    style={{
      marginTop: 10,
      padding: "8px 16px",
      borderRadius: 8,
      border: "none",
      background: theme.blue,
      color: "#fff",
      cursor: "pointer",
    }}
  >
    {children}
  </button>
);

const Input = (props) => (
  <input
    {...props}
    style={{
      padding: 10,
      borderRadius: 8,
      border: "1px solid #ccc",
      width: "100%",
      maxWidth: 300,
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
