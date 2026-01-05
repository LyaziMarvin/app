import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import config from '../config';


const Page1= () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const register = async (e) => {
    e.preventDefault();

    try {
      await axios.post(
  `${config.API_BASE_URL}${config.ADMIN.REGISTER}`,
  { email, password }
);


      alert('Registration successful');
      navigate('/about');
    } catch (err) {
      alert(err.response?.data?.error || 'Registration failed');
    }
  };

  return (
    <div style={container}>
      <form style={form} onSubmit={register}>
        <h2>Admin Registration</h2>

        <input
          style={input}
          type="email"
          placeholder="Email"
          required
          onChange={e => setEmail(e.target.value)}
        />

        <input
          style={input}
          type="password"
          placeholder="Password"
          required
          onChange={e => setPassword(e.target.value)}
        />

        <button style={button}>Register</button>

        <p style={{ marginTop: 10 }}>
          Already registered?{' '}
          <span
            style={link}
            onClick={() => navigate('/')}
          >
            Login
          </span>
        </p>
      </form>
    </div>
  );
};

const container = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100vh'
};

const form = {
  background: '#fff',
  padding: 30,
  width: 350
};

const input = {
  width: '100%',
  padding: 10,
  marginBottom: 12
};

const button = {
  padding: 10,
  background: '#0E5580',
  color: '#fff',
  border: 'none',
  cursor: 'pointer'
};

const link = {
  color: '#0E5580',
  cursor: 'pointer'
};

export default Page1;







