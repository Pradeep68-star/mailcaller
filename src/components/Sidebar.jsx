// src/components/Sidebar.jsx
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { FiHome, FiList, FiSettings, FiLogOut } from "react-icons/fi";

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // AUTO-WIDTH BASED ON PAGE
  const sidebarWidth = location.pathname === "/" ? "230px" : "180px";

  const linkStyle = {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "10px 5px",
    borderRadius: "10px",
    fontSize: "16px",
    color: "#0b2545",
    textDecoration: "none",
    transition: "0.2s",
    marginBottom: "12px",
  };

  const activeStyle = {
    background: "rgba(11,37,69,0.1)",
    fontWeight: 600,
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div
      style={{
        width: sidebarWidth,
        minWidth: "160px",
        maxWidth: "260px",
        height: "100vh",
        background: "#ffffff",
        borderRight: "1px solid #e6eaf0",
        padding: "22px 16px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between", // 🔥 pushes logout to the bottom
        transition: "width 0.25s ease",
      }}
    >
      {/* TOP MENU */}
      <div>
        <div
          style={{
            fontSize: "22px",
            fontWeight: 700,
            marginBottom: "14px",
            color: "#0b2545",
            textAlign: "center",
          }}
        >
          MENU
        </div>

        <NavLink
          to="/"
          style={({ isActive }) => ({
            ...linkStyle,
            ...(isActive ? activeStyle : {}),
          })}
        >
          <FiHome size={18} /> Dashboard
        </NavLink>

        <NavLink
          to="/logs"
          style={({ isActive }) => ({
            ...linkStyle,
            ...(isActive ? activeStyle : {}),
          })}
        >
          <FiList size={18} /> Logs
        </NavLink>

        <NavLink
          to="/settings"
          style={({ isActive }) => ({
            ...linkStyle,
            ...(isActive ? activeStyle : {}),
          })}
        >
          <FiSettings size={18} /> Settings
        </NavLink>
      </div>

      {/* LOGOUT BUTTON — FIXED AT BOTTOM */}
      <button
        onClick={handleLogout}
        style={{
          width: "75%",
          padding: "11px",
          borderRadius: "150px",
          background: "#0b2545",
          color: "white",
          border: "none",
          fontSize: "15px",
          fontWeight: 500,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px",
          boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
          transition: "0.2s",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
        onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
      >
        <FiLogOut size={18} />
        Logout
      </button>
    </div>
  );
};

export default Sidebar;
