import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";

import Dashboard from "./pages/Dashboard";
import Logs from "./pages/Logs";
import Settings from "./pages/Settings";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import NotFound from "./pages/NotFound";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

// -----------------------------
// Layout Wrapper Fix
// -----------------------------
const Layout = ({ children }) => {
  const location = useLocation();
  const isAuthPage =
    location.pathname === "/login" || location.pathname === "/signup";

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      {/* Sidebar only when NOT login/signup */}
      {!isAuthPage && <Sidebar />}

      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {/* Navbar only when NOT login/signup */}
        {!isAuthPage && <Navbar />}

        <div style={{ padding: isAuthPage ? "0px" : "20px", flex: 1, overflowY: "auto" }}>
          {children}
        </div>
      </div>
    </div>
  );
};

const App = () => {
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
      localStorage.setItem("token", token);
      window.history.replaceState({}, document.title, "/");
    }

    setAuthChecked(true); // ✅ only after token check
  }, []);

  // 🚨 Prevent rendering until token is processed
  if (!authChecked) {
    return null;
  }

  return (
    <Router>
      <Layout>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Protected Routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/logs"
            element={
              <ProtectedRoute>
                <Logs />
              </ProtectedRoute>
            }
          />

          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    </Router>
  );
};


export default App;
