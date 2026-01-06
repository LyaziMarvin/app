import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./components/home";
import About from "./components/about";
import Dashboard from "./components/dashboard";
import Page1 from "./components/page1";
import logo from "./images/cape.png";
import ProtectedRoute from "./components/protected";
import Logout from "./components/logout";
import GlobalMap from "./components/workerMap";
import PatientList from "./components/patientList";
import WorkerList from "./components/workerList";


const App = () => {
  const [demoDropdown, setDemoDropdown] = useState(false);
  const [activeLink, setActiveLink] = useState(null);

  const toggleDropdown = () => {
    setDemoDropdown(!demoDropdown);
  };

  const closeDropdown = () => {
    setDemoDropdown(false);
  };

  const handleLinkClick = (link) => {
    setActiveLink(link);
    closeDropdown();
  };

  return (
    <Router basename="/admin">
      <div style={menuStyle}>
        <Link to="/">
          <img src={logo} alt="Logo" style={logoStyle} />
        </Link>
        <Link to="/" style={{ ...welcomeStyle, textDecoration: 'none', cursor: 'pointer' }}>
          Family Circle
        </Link>

        <div style={menuLinksStyle}>
          <Logout />

          <Link style={linkStyle} to="/dashboard">Dashboard</Link>

          <div style={{ position: "relative" }}>

            <span style={{ ...linkStyle, color: "white" }} onClick={toggleDropdown}>

            </span>

            {demoDropdown && (
              <div style={dropdownStyle} onMouseLeave={closeDropdown}>
                <Link
                  style={{
                    ...dropdownLinkStyle,
                    ...(activeLink === "free" ? activeDropdownLinkStyle : {}),
                  }}
                  to="/login"
                  onClick={() => handleLinkClick("free")}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = "#0E5580";
                    e.target.style.color = "white";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = "white";
                    e.target.style.color = "#1E3A5F";
                  }}
                >
                  General-Services
                </Link>
                <Link
                  style={{
                    ...dropdownLinkStyle,
                    ...(activeLink === "personalized" ? activeDropdownLinkStyle : {}),
                  }}
                  to="/evaluations"
                  onClick={() => handleLinkClick("personalized")}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = "#0E5580";
                    e.target.style.color = "white";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = "white";
                    e.target.style.color = "#1E3A5F";
                  }}
                >
                  My-Services
                </Link>
              </div>
            )}
          </div>

          <Link style={linkStyle} to="/about"></Link>
          <Link style={linkStyle} to="/evaluation"></Link>
          <Link style={linkStyle} to="/evaluation"></Link>
        </div>
      </div>

      <div style={{ marginTop: "80px" }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/register" element={<Page1 />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/workerMap" element={<ProtectedRoute><GlobalMap /></ProtectedRoute>} />
          <Route path="/patientList" element={<ProtectedRoute><PatientList /></ProtectedRoute>} />

        </Routes>
      </div>
    </Router>
  );
};

const menuStyle = {
  backgroundColor: "#0E5580",
  height: "80px",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  width: "98%",
  position: "fixed",
  top: 0,
  left: "50%",
  transform: "translateX(-50%)",
  zIndex: 1000,
  padding: "0 25px",
};

const logoStyle = {
  height: "80px",
  marginRight: "-1px",
};

const welcomeStyle = {
  fontSize: "24px",
  fontWeight: "bold",
  color: "gold",
  textAlign: "left",
  flexGrow: 1,
};

const menuLinksStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  width: "auto",
};

const linkStyle = {
  color: "white",
  textDecoration: "none",
  fontSize: "18px",
  marginLeft: "40px",
  cursor: "pointer",
};

const dropdownStyle = {
  position: "absolute",
  top: "100%",
  backgroundColor: "white",
  borderRadius: "8px",
  padding: "10px 0",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)",
  zIndex: 1001,
  width: "180px",
};

const dropdownLinkStyle = {
  display: "block",
  padding: "12px 20px",
  color: "#1E3A5F",
  textDecoration: "none",
  fontSize: "16px",
  textAlign: "center",
  transition: "background-color 0.2s ease-in-out",
  cursor: "pointer",
};

const activeDropdownLinkStyle = {
  ...dropdownLinkStyle,
  backgroundColor: "#0E5580",
  color: "white",
};

export default App;
