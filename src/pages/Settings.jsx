const cardStyle = {
  background: "#fff",
  padding: "20px",
  borderRadius: "10px",
  boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
  marginBottom: "20px"
};

const buttonStyle = {
  padding: "12px 18px",
  background: "#4A90E2",
  color: "white",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
  fontSize: "15px",
  marginTop: "10px"
};

const Settings = () => {
  return (
    <div>
      <h1>Settings</h1>
      <p>Connect your account & customize call reminders.</p>

      {/* Gmail Connection */}
      <div style={cardStyle}>
        <h2>📩 Connect Gmail</h2>
        <p>Allow MailCaller to read events from your Gmail.</p>

        <button
          style={buttonStyle}
          onClick={() => {
            window.location.href = "http://localhost:4000/auth/google";
          }}
        >
          Connect Gmail Account
        </button>
      </div>

      {/* User Phone */}
      <div style={cardStyle}>
        <h2>📞 Your Phone Number</h2>
        <input
          placeholder="+91XXXXXXXXXX"
          style={{
            width: "100%",
            padding: "10px",
            borderRadius: "6px",
            border: "1px solid #ccc"
          }}
        />
        <button style={buttonStyle}>Save Phone Number</button>
      </div>

      {/* Detection Settings */}
      <div style={cardStyle}>
        <h2>⚙ Event Detection</h2>
        <input
          type="number"
          placeholder="Scan every X minutes"
          style={{
            width: "100%",
            padding: "10px",
            borderRadius: "6px",
            border: "1px solid #ccc"
          }}
        />
        <button style={buttonStyle}>Update Interval</button>
      </div>

      {/* Test Call */}
      <div style={cardStyle}>
        <h2>📞 Test Call</h2>
        <p>Verify that call reminders work.</p>
        <button
          style={{ ...buttonStyle, background: "green" }}
        >
          Make Test Call
        </button>
      </div>
    </div>
  );
};

export default Settings;
