// src/pages/Dashboard.jsx
import React, { useEffect, useState } from "react";

/**
 * Dashboard.jsx (complete)
 * - Enhanced inline calendar (Option C: segmented colored bar)
 * - Events produced by runScan store ISO dates (YYYY-MM-DD) for calendar mapping
 * - Click a date -> show events for that day (inside calendar card)
 * - All styling is inline (no external CSS)
 */

const theme = {
  bg: "#f6f8fb",
  cardBg: "rgba(255,255,255,0.98)",
  muted: "#6b7280",
  primary: "#0b2545",
  accent: "#0ea5a8",
  softAccent: "#eaf6f8",
  shadow: "rgba(10, 20, 35, 0.08)",
  colorsByTag: {
    NEW: "#0ea5a8", // teal
    UPCOMING: "#ff9f1c", // orange
    URGENT: "#e63946", // red
  },
};

const StatCard = ({ title, value, subtitle, fs = 14, fwTitle = 500 }) => (
  <div
    style={{
      background: theme.cardBg,
      borderRadius: 14,
      padding: "18px 20px",
      boxShadow: `0 12px 28px ${theme.shadow}`,
      minWidth: 220,
      flex: 1,
      display: "flex",
      flexDirection: "column",
      gap: 8,
    }}
  >
    <div style={{ fontSize: fs, color: theme.muted }}>{title}</div>
    <div style={{ fontSize: 28, fontWeight: fwTitle, color: theme.primary }}>{value}</div>
    <div style={{ fontSize: 13, color: theme.muted }}>{subtitle}</div>
  </div>
);

const SmallBadge = ({ children, color = "#e9f8f8", fg = theme.primary }) => (
  <div
    style={{
      background: color,
      color: fg,
      padding: "6px 10px",
      borderRadius: 12,
      fontWeight: 600,
      fontSize: 12,
      display: "inline-block",
    }}
  >
    {children}
  </div>
);

const ProgressRing = ({ size = 86, stroke = 8, percentage = 65, color = "#ffb020" }) => {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <defs>
        <linearGradient id="g1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffd27a" />
          <stop offset="100%" stopColor={color} />
        </linearGradient>
      </defs>
      <g transform={`translate(${size / 2}, ${size / 2})`}>
        <circle r={radius} cx="0" cy="0" stroke={theme.softAccent} strokeWidth={stroke} fill="transparent" />
        <circle
          r={radius}
          cx="0"
          cy="0"
          stroke="url(#g1)"
          strokeWidth={stroke}
          strokeLinecap="round"
          fill="transparent"
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={offset}
          transform="rotate(-90)"
        />
        <text x="0" y="6" textAnchor="middle" fontSize="14" fontWeight="500" fill={theme.primary}>
          {percentage}%
        </text>
      </g>
    </svg>
  );
};

const RecentItem = ({ title, date, tag }) => (
  <div
    style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      background: "#fbfdff",
      padding: "14px 18px",
      borderRadius: 10,
      boxShadow: "inset 0 1px 0 rgba(255,255,255,0.4)",
      marginBottom: 12,
    }}
  >
    <div>
      <div style={{ fontSize: 15, fontWeight: 500, color: theme.primary }}>{title}</div>
      <div style={{ fontSize: 13, color: theme.muted }}>{date}</div>
    </div>
    <div>
      {tag === "NEW" && <SmallBadge color="#eaf9fb" fg="#0b2545">NEW</SmallBadge>}
      {tag === "URGENT" && <SmallBadge color="#ffecec" fg="#941b1b">URGENT</SmallBadge>}
      {tag === "UPCOMING" && <SmallBadge color="#eaf5ff" fg="#0b3a66">UPCOMING</SmallBadge>}
    </div>
  </div>
);

/* ------------------- Inline Enhanced Calendar Component ------------------- */
/* - segmented colored bar under dates (Option C)
   - shows event list below calendar when date clicked
   - all inline styles, controlled by props
*/
const InlineCalendar = ({ events = [], selectedDate, setSelectedDate }) => {
  // events: array of { id, title, date: 'YYYY-MM-DD', tag }
  const today = new Date();
  const [viewDate, setViewDate] = useState(() => new Date(selectedDate || today.toISOString().slice(0, 10)));

  // build map: date -> array of events
  const eventsByDate = events.reduce((acc, ev) => {
    if (!ev.date) return acc;
    (acc[ev.date] = acc[ev.date] || []).push(ev);
    return acc;
  }, {});

  const month = viewDate.getMonth();
  const year = viewDate.getFullYear();

  const monthNames = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December"
  ];
  const daysShort = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

  // first day of month index, number of days
  const firstDayIdx = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // prepare cells (null for blanks)
  const cells = [];
  for (let i = 0; i < firstDayIdx; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const formatISO = (y, m, d) =>
    `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;

  const todayISO = new Date().toISOString().slice(0, 10);

  // helper for clicking prev/next month
  const prevMonth = () => setViewDate(new Date(year, month - 1, 1));
  const nextMonth = () => setViewDate(new Date(year, month + 1, 1));

  // compute segments for a date (tag counts -> segmented bar)
  const computeSegments = (dateISO) => {
    const arr = eventsByDate[dateISO] || [];
    if (arr.length === 0) return null;
    const counts = { NEW: 0, UPCOMING: 0, URGENT: 0 };
    arr.forEach((a) => {
      if (a.tag && counts.hasOwnProperty(a.tag)) counts[a.tag] += 1;
      else counts.NEW += 1; // default
    });
    const total = counts.NEW + counts.UPCOMING + counts.URGENT;
    // create segments with width percentage
    const segs = [];
    Object.keys(counts).forEach((k) => {
      if (counts[k] > 0) {
        segs.push({ tag: k, count: counts[k], width: Math.round((counts[k] / total) * 100) });
      }
    });
    return segs;
  };

  const handleSelectDay = (d) => {
    if (!d) return;
    const iso = formatISO(year, month, d);
    setSelectedDate(iso);
  };

  // render calendar
  return (
    <div style={{
      background: theme.cardBg,
      borderRadius: 14,
      padding: 18,
      boxShadow: `0 12px 28px ${theme.shadow}`,
      minWidth: 300
    }}>
      {/* header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
        <button onClick={prevMonth} style={{
          background: "transparent", border: "none", fontSize: 20, cursor: "pointer", color: theme.primary
        }}>‹</button>

        <div style={{ fontWeight: 600, fontSize: 16, color: theme.primary }}>
          {monthNames[month]} {year}
        </div>

        <button onClick={nextMonth} style={{
          background: "transparent", border: "none", fontSize: 20, cursor: "pointer", color: theme.primary
        }}>›</button>
      </div>

      {/* weekdays */}
      <div style={{
        display: "grid", gridTemplateColumns: "repeat(7,1fr)", textAlign: "center",
        marginBottom: 8, color: theme.muted, fontSize: 12, fontWeight: 600
      }}>
        {daysShort.map((d) => <div key={d}>{d}</div>)}
      </div>

      {/* days grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 8 }}>
        {cells.map((day, idx) => {
          if (!day) return <div key={idx} style={{ padding: 10 }} />;
          const iso = formatISO(year, month, day);
          const isSelected = selectedDate === iso;
          const isToday = iso === todayISO;
          const segments = computeSegments(iso);

          return (
            <div key={iso}
              onClick={() => handleSelectDay(day)}
              style={{
                padding: 10,
                borderRadius: 10,
                cursor: "pointer",
                background: isSelected ? "#0b2545" : "#ffffff",
                color: isSelected ? "#fff" : theme.primary,
                boxShadow: isSelected ? "0 6px 18px rgba(11,37,69,0.16)" : "0 1px 3px rgba(0,0,0,0.06)",
                transition: "transform 0.12s, box-shadow 0.12s",
                userSelect: "none",
                minHeight: 40,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                alignItems: "center",
                border: isToday && !isSelected ? `1px solid ${theme.softAccent}` : "1px solid transparent"
              }}>
              <div style={{ fontSize: 14, fontWeight: 600 }}>{day}</div>

              {/* segmented bar (if events exist) */}
              <div style={{ width: "100%", height: 6, borderRadius: 6, overflow: "hidden", marginTop: 8 }}>
                {!segments ? (
                  <div style={{ height: "100%", width: "100%", background: "transparent" }} />
                ) : (
                  <div style={{ display: "flex", width: "100%", height: "100%" }}>
                    {segments.map((s, i) => (
                      <div key={i}
                        style={{
                          width: `${s.width}%`,
                          background: theme.colorsByTag[s.tag] || theme.colorsByTag.NEW,
                          height: "100%"
                        }}
                        title={`${s.tag} — ${s.count}`}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected date & event list */}
      <div style={{ marginTop: 14, borderTop: "1px solid rgba(0,0,0,0.06)", paddingTop: 12 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontWeight: 600, color: theme.primary }}>
            Events on {new Date(selectedDate).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
          </div>
          <div style={{ color: theme.muted, fontSize: 13 }}>
            {eventsByDate[selectedDate] ? eventsByDate[selectedDate].length : 0}
          </div>
        </div>

        <div style={{ marginTop: 10 }}>
          {(!eventsByDate[selectedDate] || eventsByDate[selectedDate].length === 0) ? (
            <div style={{ color: theme.muted }}>No events on this day.</div>
          ) : (
            eventsByDate[selectedDate].map((ev) => (
              <div key={ev.id} style={{
                background: "#fff",
                padding: "10px 12px",
                borderRadius: 10,
                boxShadow: "0 6px 14px rgba(11,37,69,0.04)",
                marginBottom: 8,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
              }}>
                <div>
                  <div style={{ fontWeight: 600, color: theme.primary }}>{ev.title}</div>
                  <div style={{ fontSize: 13, color: theme.muted }}>{ev.tag} • {ev.date}</div>
                </div>
                <div style={{ marginLeft: 8 }}>
                  <div style={{
                    width: 10,
                    height: 30,
                    borderRadius: 6,
                    background: theme.colorsByTag[ev.tag] || theme.colorsByTag.NEW
                  }} />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
/* ------------------- End InlineCalendar ------------------- */

const Dashboard = () => {
  // scanner state (persisted)
  const [scanMode, setScanMode] = useState(() => localStorage.getItem("scanMode") || "COUNT");
  const [scanCount, setScanCount] = useState(() => parseInt(localStorage.getItem("scanCount") || "50", 10));
  const [scanHours, setScanHours] = useState(() => parseInt(localStorage.getItem("scanHours") || "24", 10));

  // results & events
  const [lastScanAt, setLastScanAt] = useState(() => localStorage.getItem("lastScanAt") || null);
  const [emailsProcessed, setEmailsProcessed] = useState(() => parseInt(localStorage.getItem("emailsProcessed") || "0", 10));
  const [eventsDetected, setEventsDetected] = useState(() => parseInt(localStorage.getItem("eventsDetected") || "0", 10));
  const [recentEvents, setRecentEvents] = useState(() => {
    const raw = localStorage.getItem("recentEvents");
    return raw ? JSON.parse(raw) : [];
  });

  // calendar selected date (ISO)
  const [selectedDate, setSelectedDate] = useState(() => {
    const raw = localStorage.getItem("dashboardSelectedDate");
    return raw ? raw : new Date().toISOString().slice(0, 10);
  });

  const [isScanning, setIsScanning] = useState(false);

  useEffect(() => {
    // inject Poppins
    const id = "pb-poppins";
    if (!document.getElementById(id)) {
      const l = document.createElement("link");
      l.id = id;
      l.rel = "stylesheet";
      l.href = "https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700&display=swap";
      document.head.appendChild(l);
    }
  }, []);

  // persist
  useEffect(() => localStorage.setItem("scanMode", scanMode), [scanMode]);
  useEffect(() => localStorage.setItem("scanCount", String(scanCount)), [scanCount]);
  useEffect(() => localStorage.setItem("scanHours", String(scanHours)), [scanHours]);
  useEffect(() => localStorage.setItem("lastScanAt", lastScanAt || ""), [lastScanAt]);
  useEffect(() => localStorage.setItem("emailsProcessed", String(emailsProcessed)), [emailsProcessed]);
  useEffect(() => localStorage.setItem("eventsDetected", String(eventsDetected)), [eventsDetected]);
  useEffect(() => localStorage.setItem("recentEvents", JSON.stringify(recentEvents)), [recentEvents]);
  useEffect(() => localStorage.setItem("dashboardSelectedDate", selectedDate), [selectedDate]);

  // simulate scan (Option 2 chosen earlier: generate events with proper ISO date)
  const runScan = async () => {
    if (scanMode === "COUNT" && (!scanCount || scanCount <= 0)) {
      alert("Enter a valid count (e.g., 50).");
      return;
    }
    if (scanMode === "TIME" && (!scanHours || scanHours <= 0)) {
      alert("Enter a valid hour range (e.g., 24).");
      return;
    }

    setIsScanning(true);
    await new Promise((r) => setTimeout(r, 900));

    const processed = scanMode === "COUNT" ? scanCount : Math.min(500, Math.round(scanHours * 20));
    const detected = Math.max(0, Math.round(processed * (0.06 + Math.random() * 0.12)));

    const now = new Date();
    const formattedNow = now.toISOString();

    // generate events with ISO date (spread across recent 7 days)
    const sampleTitles = [
      "Meeting: Vendor Sync",
      "Invoice Due",
      "Interview Invitation",
      "Weekly Standup",
      "Appointment: Doctor",
      "Team Offsite",
      "Project Delivery",
    ];

    const newEvents = Array.from({ length: detected || 1 }).map((_, i) => {
      const title = sampleTitles[Math.floor(Math.random() * sampleTitles.length)];
      const tag = Math.random() < 0.12 ? "URGENT" : Math.random() < 0.28 ? "UPCOMING" : "NEW";
      // pick a day in last 7 days (so calendar shows them)
      const when = new Date(Date.now() - Math.floor(Math.random() * 1000 * 60 * 60 * 24 * 7));
      const isoDate = when.toISOString().slice(0, 10); // YYYY-MM-DD
      return {
        id: `${formattedNow}-${i}`,
        title,
        date: isoDate,
        tag,
      };
    });

    const merged = [...newEvents, ...recentEvents].slice(0, 80); // store more if needed

    setEmailsProcessed(processed);
    setEventsDetected(detected);
    setLastScanAt(formattedNow);
    setRecentEvents(merged);
    setIsScanning(false);
  };

  const prettyLastScan = (iso) => {
    if (!iso) return "Never";
    const d = new Date(iso);
    return d.toLocaleString();
  };

  // helper to produce counts for small top stat card
  const eventsThisWeek = eventsDetected || 0;

  return (
    <div style={{
      minHeight: "100vh",
      background: `linear-gradient(120deg, ${theme.bg} 0%, #eef6fb 100%)`,
      fontFamily: "'Poppins', system-ui, -apple-system, 'Segoe UI', Roboto, Arial",
      color: theme.primary,
      padding: 28,
      boxSizing: "border-box",
    }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", gap: 24 }}>
        <div style={{ flex: 1 }}>
          <h2 style={{ margin: 0, fontSize: 22, fontWeight: 600, letterSpacing: "-0.5px" }}>Dashboard</h2>
          <div style={{ marginTop: 6, color: theme.muted }}>Overview of detected emails & alerts</div>
        </div>

        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 12, color: theme.muted }}>Workspace</div>
            <div style={{ fontWeight: 500 }}>MailCaller</div>
          </div>
          <div style={{
            width: 46, height: 46, borderRadius: 10,
            background: "linear-gradient(180deg,#fff,#f4f7fb)",
            boxShadow: "0 6px 18px rgba(10,20,35,0.06)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontWeight: 700, color: theme.primary
          }}>MC</div>
        </div>
      </div>

      {/* Top cards */}
      <div style={{ display: "flex", gap: 18, marginTop: 18 }}>
        <StatCard title="Events" value={eventsThisWeek} subtitle="Detected (last scan)" />
        <StatCard title="Calls" value="—" subtitle="Scheduled" />
        <StatCard title="Emails" value={emailsProcessed} subtitle="Processed (last scan)" />
      </div>

      {/* Main area */}
      <div style={{ display: "flex", gap: 18, marginTop: 22, alignItems: "flex-start" }}>
        {/* Left column */}
        <div style={{ flex: 1, minWidth: 520, display: "flex", flexDirection: "column", gap: 18 }}>
          {/* (You can put BrandAnimation absolutely in Login page) */}
          {/* Scanner card */}
          <div style={{
            background: theme.cardBg,
            borderRadius: 14,
            padding: 18,
            boxShadow: `0 12px 28px ${theme.shadow}`,
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ fontSize: 16, fontWeight: 700 }}>Scanner</div>
              <div style={{ color: theme.muted, fontSize: 13 }}>Choose exactly one mode</div>
            </div>

            <div style={{ display: "flex", gap: 12, marginTop: 12,fontSize: 14 }}>
              <div onClick={() => setScanMode("COUNT")} style={{
                cursor: "pointer", padding: "10px 16px", borderRadius: 10, fontWeight: 500,
                background: scanMode === "COUNT" ? theme.primary : "transparent",
                color: scanMode === "COUNT" ? "#fff" : theme.primary,
                border: scanMode === "COUNT" ? `1px solid ${theme.primary}` : "1px solid rgba(0,0,0,0.12)"
              }}>Scan by Count</div>

              <div onClick={() => setScanMode("TIME")} style={{
                cursor: "pointer", padding: "10px 16px", borderRadius: 10, fontWeight: 500,
                background: scanMode === "TIME" ? theme.primary : "transparent",
                color: scanMode === "TIME" ? "#fff" : theme.primary,
                border: scanMode === "TIME" ? `1px solid ${theme.primary}` : "1px solid rgba(0,0,0,0.12)"
              }}>Scan by Time</div>
            </div>

            <div style={{ display: "flex", gap: 12, marginTop: 14, alignItems: "center", flexWrap: "wrap" }}>
              {scanMode === "COUNT" ? (
                <>
                  <div style={{ fontSize: 13, color: theme.muted }}>Scan last</div>
                  <input type="number" value={scanCount} onChange={(e) => setScanCount(Math.max(1, parseInt(e.target.value || "0", 10)))}
                    style={{ width: 120, padding: "10px 12px", borderRadius: 10, border: "1px solid rgba(0,0,0,0.12)" }} />
                  <div style={{ fontSize: 13, color: theme.muted }}>mails</div>
                </>
              ) : (
                <>
                  <div style={{ fontSize: 13, color: theme.muted }}>Scan last</div>
                  <input type="number" value={scanHours} onChange={(e) => setScanHours(Math.max(1, parseInt(e.target.value || "0", 10)))}
                    style={{ width: 120, padding: "10px 12px", borderRadius: 10, border: "1px solid rgba(0,0,0,0.12)" }} />
                  <div style={{ fontSize: 13, color: theme.muted }}>hours</div>
                </>
              )}

              <div style={{ marginLeft: "auto", display: "flex", gap: 12 }}>
                <button onClick={() => { localStorage.setItem("scanMode", scanMode); localStorage.setItem("scanCount", String(scanCount)); localStorage.setItem("scanHours", String(scanHours)); alert("Scan settings saved."); }}
                  style={{ padding: "10px 14px", borderRadius: 10, border: "1px solid rgba(0,0,0,0.06)", background: "linear-gradient(180deg,#fff,#f7f9fb)", cursor: "pointer" }}>
                  Save Mode
                </button>

                <button onClick={runScan} disabled={isScanning}
                  style={{ padding: "10px 18px", borderRadius: 10, border: "none", background: isScanning ? "#999" : theme.primary, color: "#fff", cursor: isScanning ? "default" : "pointer", fontWeight: 700 }}>
                  {isScanning ? "Scanning…" : "Run Scan"}
                </button>
              </div>
            </div>

            <div style={{ display: "flex", gap: 12, marginTop: 18, alignItems: "center" }}>
              <div style={{ flex: 1, fontSize: 13, color: theme.muted }}>
                <div>Last scan: <strong style={{ color: theme.primary }}>{prettyLastScan(lastScanAt)}</strong></div>
                <div style={{ marginTop: 6 }}>Emails processed: <strong>{emailsProcessed}</strong> • Events found: <strong>{eventsDetected}</strong></div>
              </div>

              <div style={{ width: 120, display: "flex", justifyContent: "center" }}>
                <ProgressRing percentage={Math.min(100, eventsDetected ? Math.round((eventsDetected / Math.max(1, emailsProcessed)) * 100) : 20)} color="#ffb020" />
              </div>
            </div>
          </div>

          {/* Recent Events + Account actions */}
          <div style={{
            background: theme.cardBg, borderRadius: 14, padding: 20,
            boxShadow: `0 12px 28px ${theme.shadow}`, display: "flex", gap: 12, alignItems: "stretch"
          }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 16, fontWeight: 700, color: theme.primary, marginBottom: 12 }}>Recent Events</div>
              {recentEvents.length === 0 ? (
                <div style={{ color: theme.muted, fontSize: 14 }}>
                  No events yet — run a scan to detect events from your mailbox. Once connected to your inbox,
                  MailCaller will extract potential events and show them here.
                </div>
              ) : (
                <div style={{ marginTop: 8 }}>
                  {recentEvents.slice(0, 8).map((r) => (
                    <RecentItem key={r.id} title={r.title} date={r.date} tag={r.tag} />
                  ))}
                </div>
              )}
            </div>

            <div style={{ width: 280, display: "flex", flexDirection: "column", gap: 12 }}>
              

              <div style={{ background: "#fff", borderRadius: 12, padding: 12, boxShadow: "inset 0 1px 0 rgba(255,255,255,0.6)" }}>
                <div style={{ fontWeight: 600, marginBottom: 8 }}>Quick Actions</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  <button style={{ padding: "12px 14px", fontFamily: "verdana, sans-serif", fontSize: 13, borderRadius: 10, border: "1px solid rgba(0,0,0,0.06)", background: "linear-gradient(180deg,#fff,#f7f9fb)", cursor: "pointer" }}>Manual Scan</button>
                  <button style={{ padding: "12px 14px", fontFamily: "verdana, sans-serif", fontSize: 13, borderRadius: 10, border: "1px solid rgba(0,0,0,0.06)", background: "linear-gradient(180deg,#fff,#f7f9fb)", cursor: "pointer" }}>Retry Failed</button>
                </div>
              </div>
            </div>
          </div>
          <div style={{ background: theme.cardBg, borderRadius: 14, padding: 16, boxShadow: `0 12px 28px ${theme.shadow}` }}>
            <div style={{ fontWeight: 600, marginBottom: 10 }}>Recent Alerts</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontWeight: 500 }}>Meeting Reminder</div>
                  <div style={{ fontSize: 13, color: theme.muted }}>Dec 3 • 2:00 PM</div>
                </div>
                <SmallBadge color="#fff0e6" fg="#050327ff">REMIND</SmallBadge>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontWeight: 500 }}>Project Delivery</div>
                  <div style={{ fontSize: 13, color: theme.muted }}>Dec 5 • All day</div>
                </div>
                <SmallBadge color="#e7f7ff" fg="#0b3a66">UPCOMING</SmallBadge>
              </div>
            </div>
          </div>
        </div>

        {/* Right column */}
        <div style={{ width: 420, display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{
            background: theme.cardBg, borderRadius: 14, padding: 18, boxShadow: `0 12px 28px ${theme.shadow}`,
            display: "flex", gap: 12, alignItems: "center", justifyContent: "space-between"
          }}>
            <div>
              <div style={{ fontSize: 13, color: theme.muted }}>Workload</div>
              <div style={{ fontSize: 16, fontWeight: 600, color: theme.primary }}>Progress</div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <ProgressRing percentage={Math.min(100, Math.round((eventsDetected / Math.max(1, emailsProcessed)) * 100) || 62)} color="#ffb020" />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div style={{ background: theme.cardBg, borderRadius: 12, padding: 14, boxShadow: `0 10px 22px ${theme.shadow}` }}>
              <div style={{ fontSize: 13, color: theme.muted }}>Account</div>
              <div style={{ marginTop: 8, fontWeight: 500, fontSize: 15 }}>pradeep@example.com</div>
            </div>
            <div style={{ background: theme.cardBg, borderRadius: 12, padding: 14, boxShadow: `0 10px 22px ${theme.shadow}` }}>
              <div style={{ fontSize: 13, color: theme.muted }}>Upcoming</div>
              <div style={{ marginTop: 8, fontWeight: 500 }}>2 events</div>
            </div>
          </div>

          {/* Calendar card (INLINE enhanced calendar) */}
          <InlineCalendar events={recentEvents} selectedDate={selectedDate} setSelectedDate={setSelectedDate} />

          

          <div style={{ background: "transparent", padding: "10px 6px", textAlign: "center", color: theme.muted, fontSize: 13 }}>
            © {new Date().getFullYear()} MailCaller — Intelligent event alerts
          </div>
        </div>
      </div>

      <style>{`
        .stat-card:hover { transform: translateY(-6px); }
        @media (max-width: 980px) {
          /* stack for smaller screens */
          .left-col { min-width: 0; }
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
