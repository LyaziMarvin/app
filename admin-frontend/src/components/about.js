import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import config from '../config';


const About = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const login = async (e) => {
    e.preventDefault();
    const res = await axios.post(
  `${config.API_BASE_URL}${config.ADMIN.LOGIN}`,
  { email, password }
);


    localStorage.setItem('token', res.data.token);
    localStorage.setItem('adminID', res.data.adminID);

    navigate('/dashboard');
  };

  return (
    <div style={container}>
      <form style={form} onSubmit={login}>
        <h2>Admin Login</h2>
        <input style={input} placeholder="Email" onChange={e => setEmail(e.target.value)} />
        <input style={input} type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} />
        <button style={button}>Login</button>
        <p style={{ marginTop: 10 }}>
  Don’t have an account?{' '}
  <span
    style={{ color: '#0E5580', cursor: 'pointer' }}
    onClick={() => navigate('/register')}
  >
    Register here
  </span>
</p>

      </form>
    </div>
    
  );
  
};

const container = { display:'flex', justifyContent:'center', height:'100vh', alignItems:'center' };
const form = { background:'#fff', padding:30, width:350 };
const input = { width:'100%', padding:10, marginBottom:10 };
const button = { padding:10, background:'#0E5580', color:'#fff', border:'none' };

export default About;






