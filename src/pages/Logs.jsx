// src/pages/Logs.jsx
import React, { useState } from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";

const theme = {
  primary: "#0b2545",
  muted: "#6b7280",
  cardBg: "#ffffff",
  shadow: "0 8px 20px rgba(0,0,0,0.06)",
};

// Sample logs (replace later with backend)
const sampleLogs = [
  {
    subject: "Conference Invite",
    eventTime: "2025-12-01 11:30",
    callTime: "2025-12-01 11:00",
    status: "Completed",
  },
  {
    subject: "Team Meeting Scheduled",
    eventTime: "2025-12-02 18:00",
    callTime: "2025-12-02 17:00",
    status: "Completed",
  },
  {
    subject: "Hackathon Reminder",
    eventTime: "2025-12-03 09:00",
    callTime: "2025-12-03 08:00",
    status: "Pending",
  },
  {
    subject: "Contest Update",
    eventTime: "2025-12-04 20:00",
    callTime: "2025-12-04 19:00",
    status: "Failed",
  },
];

const Logs = () => {
  const [logs, setLogs] = useState(sampleLogs);
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");

  // Sorting Logic
  const toggleSort = (field) => {
    const order = sortField === field && sortOrder === "asc" ? "desc" : "asc";
    setSortField(field);
    setSortOrder(order);

    const sorted = [...logs].sort((a, b) => {
      if (order === "asc") return a[field] > b[field] ? 1 : -1;
      return a[field] < b[field] ? 1 : -1;
    });

    setLogs(sorted);
  };

  // Search Filter
  const filteredLogs = logs.filter((L) =>
    L.subject.toLowerCase().includes(search.toLowerCase())
  );

  // CSV Export Function
  const exportCSV = () => {
    const rows = [
      ["Email Subject", "Event Time", "Call Time", "Status"],
      ...logs.map((log) => [log.subject, log.eventTime, log.callTime, log.status]),
    ];

    const csvContent =
      "data:text/csv;charset=utf-8," + rows.map((r) => r.join(",")).join("\n");

    const link = document.createElement("a");
    link.href = encodeURI(csvContent);
    link.download = "mailcaller_logs.csv";
    link.click();
  };

  // PDF Export Table Format
  const exportPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("MailCaller Logs Report", 14, 18);

    const tableColumn = ["Email Subject", "Event Time", "Call Time", "Status"];
    const tableRows = logs.map((log) => [
      log.subject,
      log.eventTime,
      log.callTime,
      log.status,
    ]);

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 30,
      theme: "striped",
      headStyles: { fillColor: [11, 37, 69] },
    });

    doc.save("mailcaller_logs.pdf");
  };

  return (
    <div
      style={{
        padding: 30,
        background: "#f6f8fb",
        minHeight: "100vh",
        fontFamily: "'Poppins', sans-serif",
      }}
    >
      {/* HEADER */}
      <h2 style={{ fontSize: 22, fontWeight: 600 }}>Logs</h2>
      <p style={{ color: theme.muted, fontSize: 14 }}>
        All trigger logs, scheduled calls, and detected events.
      </p>

      {/* Search + Export Buttons */}
      <div
        style={{
          marginTop: 20,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {/* Search Bar */}
        <input
          type="text"
          placeholder="Search logs..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            padding: "10px 14px",
            width: 260,
            borderRadius: 10,
            border: "1px solid rgba(0,0,0,0.14)",
            fontSize: 14,
          }}
        />

        {/* Export Buttons */}
        <div style={{ display: "flex", gap: 10 }}>
          {/* EXPORT CSV */}
          <button
            onClick={exportCSV}
            style={{
              padding: "10px 18px",
              borderRadius: 14,
              background: "#0b2545",
              color: "#fff",
              border: "1px solid #0b2545",
              cursor: "pointer",
              fontSize: 14,
              fontWeight: 500,
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            }}
            onMouseEnter={(e) => (e.target.style.background = "#102f5f")}
            onMouseLeave={(e) => (e.target.style.background = "#0b2545")}
          >
            Export CSV
          </button>

          {/* EXPORT PDF */}
          
        </div>
      </div>

      {/* TABLE */}
      <div
        style={{
          background: theme.cardBg,
          marginTop: 25,
          borderRadius: 16,
          padding: 10,
          boxShadow: theme.shadow,
        }}
      >
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#f1f5f9" }}>
              <th
                style={{ padding: 12, cursor: "pointer" }}
                onClick={() => toggleSort("subject")}
              >
                Email Subject ▲▼
              </th>
              <th
                style={{ padding: 12, cursor: "pointer" }}
                onClick={() => toggleSort("eventTime")}
              >
                Event Time ▲▼
              </th>
              <th
                style={{ padding: 12, cursor: "pointer" }}
                onClick={() => toggleSort("callTime")}
              >
                Call Time ▲▼
              </th>
              <th style={{ padding: 12 }}>Status</th>
            </tr>
          </thead>

          <tbody>
            {filteredLogs.map((log, i) => {
              const statusStyles = {
                Completed: { bg: "#d4f7d4", color: "#0b7f0b" },
                Pending: { bg: "#ffe9c2", color: "#ad5b00" },
                Failed: { bg: "#ffd4d4", color: "#b30000" },
              };

              return (
                <tr
                  key={i}
                  style={{ transition: "0.2s" }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = "#f8fbff")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "transparent")
                  }
                >
                  <td style={{ padding: 12, fontSize: 14 }}>{log.subject}</td>
                  <td style={{ padding: 12, color: theme.muted }}>
                    {log.eventTime}
                  </td>
                  <td style={{ padding: 12, color: theme.muted }}>
                    {log.callTime}
                  </td>
                  <td style={{ padding: 12 }}>
                    <span
                      style={{
                        padding: "6px 12px",
                        borderRadius: 8,
                        fontSize: 13,
                        fontWeight: 500,
                        background: statusStyles[log.status].bg,
                        color: statusStyles[log.status].color,
                      }}
                    >
                      {log.status}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Logs;
