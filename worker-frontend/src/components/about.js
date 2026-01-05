import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import { ENV } from "../config/env";

const About = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
  ENV.WORKER_LOGIN_URL,
  { email, password }
);


      localStorage.setItem('token', response.data.token);
      localStorage.setItem('workerID', response.data.workerID);

      alert('Login successful');
      navigate('/dashboard');

      console.log('TOKEN:', response.data.token);

    } catch (error) {
      alert(error.response?.data?.error || 'Login failed');
      
    }
    
  };

  return (
    <div style={bodyStyle}>
      <form style={formStyle} onSubmit={handleLogin}>
        <h1 style={headerStyle}>Remote Worker Login</h1>

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

        <button style={buttonStyle} type="submit">Login</button>

        <p>
          Don’t have an account?{' '}
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


export default About;



