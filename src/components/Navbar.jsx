const Navbar = () => {
  return (
    <div style={{
      height: "60px",
      background: "#ffffff",
      borderBottom: "1px solid #e5e5e5",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "0 20px",
      fontWeight: "600",
      fontSize: "18px"
    }}>
      <div>📞 MailCaller</div>
      <div style={{ opacity: 0.7 }}>Settings ⚙️</div>
    </div>
  );
};

export default Navbar;
