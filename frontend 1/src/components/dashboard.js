import { useState, useEffect } from 'react';
import axios from 'axios';
import Env from '../config';

const Dashboard = () => {
  const patientID = localStorage.getItem('patientID');

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [spokenLanguage, setSpokenLanguage] = useState('');
  const [country, setCountry] = useState('');
  const [city, setCity] = useState('');          // ✅ added
  const [whatsapp, setWhatsapp] = useState('');
  const [loading, setLoading] = useState(true);

  // 🔹 Fetch profile on load
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`${Env.PATIENT_PROFILE}/${patientID}`);

        setFirstName(res.data.firstName || '');
        setLastName(res.data.lastName || '');
        setSpokenLanguage(res.data.spokenLanguage || '');
        setCountry(res.data.country || '');
        setCity(res.data.city || '');             // ✅ added
        setWhatsapp(res.data.whatsapp || '');
      } catch (err) {
        alert('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [patientID]);

  const saveProfile = async () => {
    await axios.post(Env.PATIENT_PROFILE, {
      patientID,
      firstName,
      lastName,
      spokenLanguage,
      country,
      city,                                       // ✅ added
      whatsapp
    });

    alert('Profile updated');
  };

  if (loading) return <p style={{ textAlign: 'center' }}>Loading profile...</p>;

  return (
    <div style={bodyStyle}>
      <div style={formStyle}>
        <h1 style={headerStyle}>User Profile</h1>

        <input
          style={inputStyle}
          placeholder="First Name"
          value={firstName}
          onChange={e => setFirstName(e.target.value)}
        />

        <input
          style={inputStyle}
          placeholder="Last Name"
          value={lastName}
          onChange={e => setLastName(e.target.value)}
        />

        <input
          style={inputStyle}
          placeholder="Spoken Language"
          value={spokenLanguage}
          onChange={e => setSpokenLanguage(e.target.value)}
        />

        <input
          style={inputStyle}
          placeholder="Country"
          value={country}
          onChange={e => setCountry(e.target.value)}
        />

        {/* ✅ CITY FIELD */}
        <input
          style={inputStyle}
          placeholder="City"
          value={city}
          onChange={e => setCity(e.target.value)}
        />

        <input
          style={inputStyle}
          placeholder="WhatsApp Number"
          value={whatsapp}
          onChange={e => setWhatsapp(e.target.value)}
        />

        <button style={buttonStyle} onClick={saveProfile}>
          Save Changes
        </button>
      </div>
    </div>
  );
};

/* ===== styles ===== */
const bodyStyle = {
  paddingTop: '80px',
  display: 'flex',
  justifyContent: 'center'
};

const formStyle = {
  width: '420px',
  background: '#fff',
  padding: '30px',
  borderRadius: '6px'
};

const headerStyle = {
  textAlign: 'center',
  marginBottom: '20px'
};

const inputStyle = {
  width: '100%',
  padding: '10px',
  marginBottom: '10px'
};

const buttonStyle = {
  padding: '10px',
  background: '#0E5580',
  color: '#fff',
  border: 'none',
  cursor: 'pointer',
  width: '100%'
};

export default Dashboard;

