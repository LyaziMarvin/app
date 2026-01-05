import React from "react";
import { useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';

const Logout = () => {
  const navigate = useNavigate();

  const workerId = localStorage.getItem('workerID');
  const isLoggedIn = !!workerId;

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('workerID');

    alert('Logout successful');
    navigate('/about'); // redirect to login
  };

  if (!isLoggedIn) return null;

  return (
    <div style={logoutContainer} onClick={handleLogout}>
      <LogOut size={30} color="white" style={iconStyle} />
      <span style={logoutTextStyle}>Logout</span>
    </div>
  );
};

const logoutContainer = {
  position: 'fixed',
  top: '10px',
  right: '10px',
  backgroundColor: '#0E5580',
  padding: '10px 15px',
  borderRadius: '25px',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
};

const iconStyle = {
  cursor: 'pointer',
};

const logoutTextStyle = {
  color: 'white',
  marginLeft: '8px',
  fontSize: '16px',
  fontWeight: 'bold',
};

export default Logout;

