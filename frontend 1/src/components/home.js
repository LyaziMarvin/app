import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import logo from "./images/cape1.png";
import heroImage from "./images/ruben9.jpeg";

const useUserId = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  return queryParams.get("userId");
};

function Home() {
  const navigate = useNavigate();
  const userId = useUserId();
  const [storedUserId, setStoredUserId] = useState(null);

  useEffect(() => {
    if (userId) {
      setStoredUserId(userId);
      localStorage.setItem("userID", userId);
    }
  }, [userId]);

  return (
    <div style={containerStyle}>
      {/* HERO SECTION */}
      <section style={heroStyle}>
        <div style={heroTextStyle}>
          <h1 style={titleStyle}>
            Kin-Keepers Family Circle
          </h1>
          <p style={subtitleStyle}>
            A secure information and collaboration platform designed
            for Nursing Homes, Care Providers, and Families.
          </p>

          <div style={heroButtons}>
            <button style={primaryButton} onClick={() => navigate("/about")}>
              User Login
            </button>
            <button style={secondaryButton}>
              Learn More
            </button>
          </div>
        </div>

        <img src={heroImage} alt="Care community" style={heroImageStyle} />
      </section>

      {/* ROLES SECTION */}
      <section style={sectionStyle}>
        <h2 style={sectionTitle}>Who Uses Family Circle?</h2>

        <div style={cardGrid}>
          <RoleCard
            title="Administrator (Kin-Keeper)"
            items={[
              "Create and manage the Nursing Home Family Circle",
              "Invite staff and assign privileges",
              "Maintain the All-Residents-Staff document",
              "Access dashboards and reports"
            ]}
          />

          <RoleCard
            title="Management"
            items={[
              "Full administrative privileges",
              "Oversight of residents and staff",
              "Run operational and care reports"
            ]}
          />

          <RoleCard
            title="Nursing Staff"
            items={[
              "Query resident information",
              "Update medications and special needs",
              "Support daily resident care"
            ]}
          />

          <RoleCard
            title="Care Providers"
            items={[
              "Basic querying access",
              "Quick identification of residents",
              "Improved communication and care continuity"
            ]}
          />

          <RoleCard
            title="Family Members (Limited / Future)"
            items={[
              "Provide resident background information",
              "Submit updates via email",
              "Future access to resident-specific Family Circles"
            ]}
          />
        </div>
      </section>

      {/* CORE FEATURES */}
      <section style={sectionAltStyle}>
        <h2 style={sectionTitle}>Core Capabilities</h2>

        <ul style={featureList}>
          <li>Centralized All-Residents-Staff Document</li>
          <li>Secure role-based access control</li>
          <li>Fast querying of resident and staff information</li>
          <li>Medication and special-needs tracking</li>
          <li>Future: picture recognition and language translation</li>
        </ul>
      </section>

      {/* FOOTER */}
      <footer style={footerStyle}>
        <img src={logo} alt="Kin-Keepers Logo" style={logoStyle} />
        <p style={footerText}>
          © {new Date().getFullYear()} Kin-Keepers. Supporting dignity,
          care, and connection.
        </p>
      </footer>
    </div>
  );
}

/* SMALL REUSABLE COMPONENT */
function RoleCard({ title, items }) {
  return (
    <div style={roleCardStyle}>
      <h3 style={roleTitle}>{title}</h3>
      <ul style={roleList}>
        {items.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

/* STYLES */

const containerStyle = {
  fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
  color: "#0f172a"
};

const heroStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "60px",
  backgroundColor: "#f8fafc"
};

const heroTextStyle = {
  maxWidth: "600px"
};

const titleStyle = {
  fontSize: "40px",
  fontWeight: "800",
  marginBottom: "16px"
};

const subtitleStyle = {
  fontSize: "20px",
  color: "#475569",
  lineHeight: "1.6"
};

const heroButtons = {
  marginTop: "24px",
  display: "flex",
  gap: "16px"
};

const primaryButton = {
  padding: "12px 24px",
  backgroundColor: "#0369a1",
  color: "white",
  border: "none",
  borderRadius: "8px",
  fontSize: "16px",
  cursor: "pointer"
};

const secondaryButton = {
  padding: "12px 24px",
  backgroundColor: "transparent",
  color: "#0369a1",
  border: "2px solid #0369a1",
  borderRadius: "8px",
  fontSize: "16px",
  cursor: "pointer"
};

const heroImageStyle = {
  width: "420px",
  borderRadius: "20px"
};

const sectionStyle = {
  padding: "60px",
  backgroundColor: "white"
};

const sectionAltStyle = {
  padding: "60px",
  backgroundColor: "#f1f5f9"
};

const sectionTitle = {
  fontSize: "28px",
  marginBottom: "32px"
};

const cardGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
  gap: "24px"
};

const roleCardStyle = {
  backgroundColor: "white",
  padding: "24px",
  borderRadius: "16px",
  boxShadow: "0 10px 25px rgba(0,0,0,0.06)"
};

const roleTitle = {
  fontSize: "18px",
  marginBottom: "12px",
  color: "#0369a1"
};

const roleList = {
  paddingLeft: "18px",
  lineHeight: "1.6",
  color: "#475569"
};

const featureList = {
  fontSize: "18px",
  lineHeight: "1.8",
  paddingLeft: "20px"
};

const footerStyle = {
  padding: "30px",
  backgroundColor: "#0f172a",
  color: "white",
  display: "flex",
  flexDirection: "column",
  alignItems: "center"
};

const footerText = {
  marginTop: "12px",
  fontSize: "14px",
  opacity: 0.8
};

const logoStyle = {
  width: "90px"
};

export default Home;



