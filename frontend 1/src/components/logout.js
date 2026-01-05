import { useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';

const Logout = () => {
  const navigate = useNavigate();
  const patientID = localStorage.getItem('patientID');

  if (!patientID) return null;

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('patientID');
    navigate('/');
  };

  return (
    <div style={logoutStyle} onClick={handleLogout}>
      <LogOut color="white" />
      <span style={{ marginLeft: '8px', color: 'white' }}>Logout</span>
    </div>
  );
};

const logoutStyle = {
  position: 'fixed',
  top: '10px',
  right: '10px',
  background: '#0E5580',
  padding: '10px 15px',
  borderRadius: '20px',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center'
};

export default Logout;



