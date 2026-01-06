import { useState, useEffect } from 'react';
import axios from "axios";
import { ENV } from "../config/env";

const Dashboard = () => {
  const workerID = localStorage.getItem('workerID');

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [spokenLanguage, setSpokenLanguage] = useState('');
  const [country, setCountry] = useState('');
  const [city, setCity] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [rate, setRate] = useState(5);              // ✅ NEW
  const [status, setStatus] = useState('available');
  const [loading, setLoading] = useState(true);

  // 🔹 Fetch worker profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(
          `${ENV.WORKER_PROFILE_URL}/${workerID}`
        );

        setFirstName(res.data.firstName || '');
        setLastName(res.data.lastName || '');
        setSpokenLanguage(res.data.spokenLanguage || '');
        setCountry(res.data.country || '');
        setCity(res.data.city || '');
        setWhatsapp(res.data.whatsapp || '');
        setRate(res.data.rate || 5);                // ✅ NEW
        setStatus(res.data.status || 'available');
      } catch {
        alert('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [workerID]);

  const saveProfile = async () => {
    await axios.post(ENV.WORKER_PROFILE_URL, {
      workerID,
      firstName,
      lastName,
      spokenLanguage,
      country,
      city,
      whatsapp,
      rate                                      // ✅ SEND RATE
    });

    alert('Profile updated');
  };

  const updateStatus = async () => {
    await axios.post(ENV.WORKER_STATUS_URL, {
      workerID,
      status
    });

    alert('Status updated');
  };

  if (loading) return <p style={{ textAlign: 'center' }}>Loading profile...</p>;

  return (
    <div style={bodyStyle}>
      <div style={formStyle}>
        <h1 style={headerStyle}>Worker Profile</h1>

        <Input label="First Name" value={firstName} setValue={setFirstName} />
        <Input label="Last Name" value={lastName} setValue={setLastName} />
        <Input label="Spoken Language" value={spokenLanguage} setValue={setSpokenLanguage} />
        <Input label="Country" value={country} setValue={setCountry} />
        <Input label="City" value={city} setValue={setCity} />
        <Input label="WhatsApp Number" value={whatsapp} setValue={setWhatsapp} />

        {/* ✅ RATE DROPDOWN */}
        <div style={inputContainerStyle}>
          <label>Hourly Rate (USD)</label>
          <select
            style={inputStyle}
            value={rate}
            onChange={e => setRate(Number(e.target.value))}
          >
            {[...Array(20)].map((_, i) => (
              <option key={i + 1} value={i + 1}>
                ${i + 1} / hour
              </option>
            ))}
          </select>
        </div>

        <button style={buttonStyle} onClick={saveProfile}>
          Save Profile
        </button>

        <hr />

        <select
          style={inputStyle}
          value={status}
          onChange={e => setStatus(e.target.value)}
        >
          <option value="available">Available</option>
          <option value="unavailable">Unavailable</option>
        </select>

        <button style={buttonStyle} onClick={updateStatus}>
          Update Status
        </button>
      </div>
    </div>
  );
};

/* ===== Reusable input ===== */
const Input = ({ label, value, setValue }) => (
  <div style={inputContainerStyle}>
    <label>{label}</label>
    <input
      style={inputStyle}
      value={value}
      onChange={e => setValue(e.target.value)}
    />
  </div>
);

/* ===== styles ===== */
const bodyStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100vh',
  background: '#f4f4f4'
};

const formStyle = {
  background: '#fff',
  padding: '30px',
  width: '380px',
  borderRadius: '8px'
};

const headerStyle = {
  textAlign: 'center',
  marginBottom: '20px'
};

const inputContainerStyle = {
  marginBottom: '15px',
  display: 'flex',
  flexDirection: 'column'
};

const inputStyle = {
  padding: '8px',
  fontSize: '14px'
};

const buttonStyle = {
  padding: '10px',
  marginTop: '10px',
  background: '#007bff',
  color: '#fff',
  border: 'none',
  cursor: 'pointer'
};

export default Dashboard;






