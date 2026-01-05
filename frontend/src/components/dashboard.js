import { useState, useEffect } from 'react';
import axios from "axios";
import { ENV } from "../config/env";



const Dashboard = () => {
  const workerID = localStorage.getItem('workerID');

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [spokenLanguage, setSpokenLanguage] = useState('');
  const [country, setCountry] = useState('');
  const [city, setCity] = useState('');            // ✅ added
  const [whatsapp, setWhatsapp] = useState('');
  const [status, setStatus] = useState('available');
  const [loading, setLoading] = useState(true);

  // 🔹 Fetch worker profile on load
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
        setCity(res.data.city || '');              // ✅ added
        setWhatsapp(res.data.whatsapp || '');
        setStatus(res.data.status || 'available');
      } catch (err) {
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
      city,                                           // ✅ added
      whatsapp
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

  if (loading) {
    return <p style={{ textAlign: 'center' }}>Loading profile...</p>;
  }

  return (
    <div style={bodyStyle}>
      <div style={formStyle}>
        <h1 style={headerStyle}>Worker Profile</h1>

        <div style={inputContainerStyle}>
          <label>First Name</label>
          <input
            style={inputStyle}
            value={firstName}
            onChange={e => setFirstName(e.target.value)}
          />
        </div>

        <div style={inputContainerStyle}>
          <label>Last Name</label>
          <input
            style={inputStyle}
            value={lastName}
            onChange={e => setLastName(e.target.value)}
          />
        </div>

        <div style={inputContainerStyle}>
          <label>Spoken Language</label>
          <input
            style={inputStyle}
            value={spokenLanguage}
            onChange={e => setSpokenLanguage(e.target.value)}
          />
        </div>

        <div style={inputContainerStyle}>
          <label>Country</label>
          <input
            style={inputStyle}
            value={country}
            onChange={e => setCountry(e.target.value)}
          />
        </div>

        {/* ✅ CITY FIELD */}
        <div style={inputContainerStyle}>
          <label>City</label>
          <input
            style={inputStyle}
            value={city}
            onChange={e => setCity(e.target.value)}
          />
        </div>

        <div style={inputContainerStyle}>
          <label>WhatsApp Number</label>
          <input
            style={inputStyle}
            value={whatsapp}
            onChange={e => setWhatsapp(e.target.value)}
          />
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





