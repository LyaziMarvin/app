import { useNavigate } from 'react-router-dom';

const Logout = () => {
  const navigate = useNavigate();
  const adminID = localStorage.getItem('adminID');

  if (!adminID) return null;

  return (
    <button
      style={logout}
      onClick={() => {
        localStorage.clear();
        navigate('/about');
      }}
    >
      Logout
    </button>
  );
};

const logout = {
  position:'fixed',
  top:10,
  right:10,
  padding:10,
  background:'#0E5580',
  color:'#fff',
  border:'none'
};

export default Logout;




