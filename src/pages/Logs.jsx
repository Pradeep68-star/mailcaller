const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
  background: "white",
  boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
  borderRadius: "10px",
  overflow: "hidden",
  marginTop: "20px"
};

const Logs = () => {
  return (
    <div>
      <h1>Logs</h1>
      <p>All call triggers and detected events appear here.</p>

      <table style={tableStyle}>
        <thead>
          <tr style={{ background: "#f3f4f6", textAlign: "left" }}>
            <th style={{ padding: "12px" }}>Email Subject</th>
            <th style={{ padding: "12px" }}>Event Time</th>
            <th style={{ padding: "12px" }}>Call Scheduled</th>
            <th style={{ padding: "12px" }}>Status</th>
          </tr>
        </thead>

        <tbody>
          <tr>
            <td style={{ padding: "12px" }}>Team Meeting Scheduled</td>
            <td style={{ padding: "12px" }}>2025-12-02 18:00</td>
            <td style={{ padding: "12px" }}>2025-12-02 17:00</td>
            <td style={{ padding: "12px", color: "green", fontWeight: "600" }}>
              Completed
            </td>
          </tr>

          <tr>
            <td style={{ padding: "12px" }}>Hackathon Reminder</td>
            <td style={{ padding: "12px" }}>2025-12-03 09:00</td>
            <td style={{ padding: "12px" }}>2025-12-03 08:00</td>
            <td style={{ padding: "12px", color: "orange", fontWeight: "600" }}>
              Pending
            </td>
          </tr>

          <tr>
            <td style={{ padding: "12px" }}>Contest Update</td>
            <td style={{ padding: "12px" }}>2025-12-04 20:00</td>
            <td style={{ padding: "12px" }}>2025-12-04 19:00</td>
            <td style={{ padding: "12px", color: "red", fontWeight: "600" }}>
              Failed
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default Logs;
