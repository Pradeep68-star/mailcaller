import React, { useState, useEffect } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import "jspdf-autotable";

const API = "http://localhost:5000/api";

const Logs = () => {
  const [logs, setLogs] = useState([]);
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");

  const token = localStorage.getItem("token");

  // 🔥 FETCH DATA
  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const res = await axios.get(`${API}/logs`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setLogs(res.data);
    } catch (err) {
      console.error("❌ Failed to fetch logs", err);
    }
  };

  // 🔥 SORT
  const toggleSort = (field) => {
    const order =
      sortField === field && sortOrder === "asc" ? "desc" : "asc";

    setSortField(field);
    setSortOrder(order);

    const sorted = [...logs].sort((a, b) => {
      if (order === "asc") return a[field] > b[field] ? 1 : -1;
      return a[field] < b[field] ? 1 : -1;
    });

    setLogs(sorted);
  };

  // 🔥 SEARCH
  const filteredLogs = logs.filter((L) =>
    L.subject.toLowerCase().includes(search.toLowerCase())
  );

  // 🔥 CSV EXPORT
  const exportCSV = () => {
    const rows = [
      ["Email Subject", "Event Time", "Call Time", "Status"],
      ...logs.map((log) => [
        log.subject,
        log.eventTime,
        log.callTime,
        log.status,
      ]),
    ];

    const csvContent =
      "data:text/csv;charset=utf-8," +
      rows.map((r) => r.join(",")).join("\n");

    const link = document.createElement("a");
    link.href = encodeURI(csvContent);
    link.download = "mailcaller_logs.csv";
    link.click();
  };

  // 🔥 PDF EXPORT
  const exportPDF = () => {
    const doc = new jsPDF();

    doc.text("MailCaller Logs", 14, 15);

    const tableColumn = [
      "Email Subject",
      "Event Time",
      "Call Time",
      "Status",
    ];

    const tableRows = logs.map((log) => [
      log.subject,
      new Date(log.eventTime).toLocaleString(),
      new Date(log.callTime).toLocaleString(),
      log.status,
    ]);

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    });

    doc.save("logs.pdf");
  };

  // 🔥 STYLES (FIXED POSITION)
  const thStyle = {
    padding: "12px",
    cursor: "pointer",
    fontWeight: "600",
  };

  const tdStyle = {
    padding: "12px",
    fontSize: "14px",
    color: "#333",
  };

  return (
    <div
      style={{
        padding: 30,
        background: "#f6f8fb",
        minHeight: "100vh",
      }}
    >
      <h2>Logs</h2>

      {/* 🔍 SEARCH + EXPORT */}
      <div
        style={{
          marginTop: 20,
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <input
          placeholder="Search logs..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            padding: "8px",
            borderRadius: "6px",
            border: "1px solid #ccc",
          }}
        />

        <div style={{ display: "flex", gap: 10 }} >
          <button onClick={exportCSV} style={{fontSize: "12px", background: "#0b2545", color: "#fff" }}>Export CSV</button>
          <button onClick={exportPDF} style={{fontSize: "12px", background: "#0b2545", color: "#fff" }}>Export PDF</button>
        </div>
      </div>

      {/* 📊 TABLE */}
      <div
        style={{
          background: "#fff",
          marginTop: 20,
          padding: 15,
          borderRadius: 12,
          boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
        }}
      >
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            textAlign: "left",
          }}
        >
          {/* 🔥 HEADER */}
          <thead>
            <tr style={{ background: "#0b2545", color: "#fff" }}>
              <th style={thStyle} onClick={() => toggleSort("subject")}>
                Email Subject ▲▼
              </th>
              <th style={thStyle} onClick={() => toggleSort("eventTime")}>
                Event Time ▲▼
              </th>
              <th style={thStyle} onClick={() => toggleSort("callTime")}>
                Call Time ▲▼
              </th>
              <th style={thStyle}>Status</th>
            </tr>
          </thead>

          {/* 🔥 BODY */}
          <tbody>
            {filteredLogs.map((log, i) => {
              const statusStyles = {
                Completed: { bg: "#d4f7d4", color: "#0b7f0b" },
                Pending: { bg: "#ffe9c2", color: "#ad5b00" },
                Failed: { bg: "#ffd4d4", color: "#b30000" },
                scheduled: { bg: "#e3e8ff", color: "#1d2bbf" },
              };

              return (
                <tr
                  key={i}
                  style={{
                    borderBottom: "1px solid #eee",
                    background: i % 2 === 0 ? "#fafafa" : "#fff",
                    transition: "0.2s",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = "#eef3ff")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background =
                      i % 2 === 0 ? "#fafafa" : "#fff")
                  }
                >
                  <td style={tdStyle}>{log.subject}</td>

                  <td style={tdStyle}>
                    {new Date(log.eventTime).toLocaleString()}
                  </td>

                  <td style={tdStyle}>
                    {new Date(log.callTime).toLocaleString()}
                  </td>

                  <td style={tdStyle}>
                    <span
                      style={{
                        padding: "6px 12px",
                        borderRadius: 20,
                        fontSize: 12,
                        fontWeight: 500,
                        background: statusStyles[log.status]?.bg,
                        color: statusStyles[log.status]?.color,
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