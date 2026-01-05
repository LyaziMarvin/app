import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Env from '../config';



const About = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(Env.PATIENT_LOGIN, { email, password });

      localStorage.setItem('token', res.data.token);
      localStorage.setItem('patientID', res.data.patientID);

      navigate('/dashboard');
    } catch (err) {
      alert(err.response?.data?.error || 'Login failed');
    }
  };

  return (
    <div style={bodyStyle}>
      <form style={formStyle} onSubmit={handleLogin}>
        <h1 style={headerStyle}>User Login</h1>

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
          Login
        </button>

        <p>
          No account?{' '}
          <span
            onClick={() => navigate('/register')}
            style={{ cursor: 'pointer', color: 'blue' }}
          >
            Register here
          </span>
        </p>
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
  borderRadius: '8px',
  boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
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
  background: '#0E5580',
  color: '#fff',
  border: 'none',
  cursor: 'pointer'
};

export default About;





