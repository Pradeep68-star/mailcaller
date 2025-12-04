import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";

import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";

import Dashboard from "./pages/Dashboard";
import Logs from "./pages/Logs";
import Settings from "./pages/Settings";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Handle token returned from Google OAuth (URL: ?token=xxxxx)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
      localStorage.setItem("token", token);
      setIsLoggedIn(true);
      // Clean URL by removing ?token=
      window.history.replaceState({}, document.title, "/");
    } else {
      const existingToken = localStorage.getItem("token");
      if (existingToken) setIsLoggedIn(true);
    }
  }, []);

  return (
    <Router>
      <div style={{ display: "flex", height: "100vh" }}>

        {/* Show Sidebar + Navbar only when logged in */}
        {isLoggedIn && <Sidebar />}
        
        <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          {isLoggedIn && <Navbar />}

          <div style={{ padding: "20px", flex: 1, overflowY: "auto" }}>
            <Routes>

              {/* Public Route */}
              <Route path="/login" element={<Login />} />

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

              {/* 404 Page */}
              <Route path="*" element={<NotFound />} />

            </Routes>
          </div>
        </div>

      </div>
    </Router>
  );
};

export default App;
