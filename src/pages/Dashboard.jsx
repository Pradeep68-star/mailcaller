const cardStyle = {
  background: "white",
  padding: "20px",
  borderRadius: "10px",
  boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
  marginBottom: "20px"
};

const Dashboard = () => {
  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome to MailCaller Dashboard.</p>

      {/* Gmail Sync Status */}
      <div style={cardStyle}>
        <h2>📩 Gmail Sync Status</h2>
        <p>Last sync: <strong>5 minutes ago</strong></p>
        <button style={{
          padding: "10px 16px",
          background: "#4A90E2",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer"
        }}>
          Sync Now
        </button>
      </div>

      {/* Upcoming Calls */}
      <div style={cardStyle}>
        <h2>📞 Upcoming Calls</h2>
        <ul>
          <li>Hackathon Meeting – Today 6:00 PM</li>
          <li>Contest Reminder – Tomorrow 9:00 AM</li>
        </ul>
      </div>

      {/* Recently Detected Emails */}
      <div style={cardStyle}>
        <h2>📧 Recently Detected Emails</h2>
        <table width="100%" style={{ borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ textAlign: "left", borderBottom: "1px solid #ccc" }}>
              <th>Subject</th>
              <th>Date</th>
              <th>Source</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Team Meeting Scheduled</td>
              <td>2025-12-02</td>
              <td>Gmail</td>
            </tr>
            <tr>
              <td>Contest Registration Open</td>
              <td>2025-12-01</td>
              <td>Gmail</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Summary Cards */}
      <div style={{ display: "flex", gap: "20px" }}>
        <div style={cardStyle}>
          <h3>Total Emails Processed</h3>
          <p>125</p>
        </div>
        <div style={cardStyle}>
          <h3>Total Events Detected</h3>
          <p>42</p>
        </div>
        <div style={cardStyle}>
          <h3>Total Calls Scheduled</h3>
          <p>18</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
