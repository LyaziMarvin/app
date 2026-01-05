import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ENV } from "../config/env";


const Page1 = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
     await axios.post(ENV.WORKER_REGISTER_URL, {
  email,
  password
});

      alert('Registration successful');
      navigate('/about');
    } catch (error) {
      alert(error.response?.data?.error || 'Registration failed');
    }
  };

  return (
    <div style={bodyStyle}>
      <form style={formStyle} onSubmit={handleRegister}>
        <h1 style={headerStyle}>Register</h1>

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

        <button style={buttonStyle} type="submit">Register</button>
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


export default Page1;





