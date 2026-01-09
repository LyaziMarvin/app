import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Env from '../config';
const Page1 = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      await axios.post(Env.PATIENT_REGISTER, { email, password });


      alert('Registration successful');
      navigate('/about');
    } catch (err) {
      alert(err.response?.data?.error || 'Registration failed');
    }
  };

  return (
    <div style={bodyStyle}>
      <form style={formStyle} onSubmit={handleRegister}>
        <h1 style={headerStyle}>User Registration</h1>

        <div style={inputContainerStyle}>
          <label>Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={inputStyle}
          />
        </div>

        <div style={inputContainerStyle}>
          <label>Password</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={inputStyle}
          />
        </div>

        <button style={buttonStyle} type="submit">
          Register
        </button>
      </form>
    </div>
  );
};

// styles (LOCAL)
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
  width: '350px',
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
  padding: '8px'
};

const buttonStyle = {
  padding: '10px',
  background: '#0E5580',
  color: '#fff',
  border: 'none',
  cursor: 'pointer'
};

export default Page1;






