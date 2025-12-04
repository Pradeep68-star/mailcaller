import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <div style={{
      width: "200px",
      background: "#f8f9fa",
      borderRight: "1px solid #e5e5e5",
      paddingTop: "20px",
      display: "flex",
      flexDirection: "column",
      gap: "15px"
    }}>
      <Link to="/" style={linkStyle}>📊 Dashboard</Link>
      <Link to="/logs" style={linkStyle}>📜 Logs</Link>
      <Link to="/settings" style={linkStyle}>⚙️ Settings</Link>
    </div>
  );
};

const linkStyle = {
  padding: "12px 20px",
  fontSize: "16px",
  textDecoration: "none",
  color: "#333",
};

export default Sidebar;
