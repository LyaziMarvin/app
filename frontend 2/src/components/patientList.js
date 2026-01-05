import { useEffect, useState } from 'react';
import axios from 'axios';
import config from '../config';

const PatientList = ({ onSelect }) => {
  const [patients, setPatients] = useState([]);

  const fetchPatients = () => {
    axios.get(`${config.API_BASE_URL}${config.ADMIN.PATIENTS}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    }).then(res => setPatients(res.data));
  };

  useEffect(fetchPatients, []);

  const deletePatient = async (patientID, e) => {
    e.stopPropagation();

    if (!window.confirm('Delete this patient permanently?')) return;

    await axios.delete(
      `${config.API_BASE_URL}${config.ADMIN.DELETE_PATIENT(patientID)}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      }
    );

    fetchPatients();
  };

  return (
    <div style={sidebar}>
      <h3>Users</h3>

      {patients.map(p => (
        <div
          key={p.patientID}
          style={item}
          onClick={() => onSelect(p)}
        >
          <span>
            {p.firstName} {p.lastName}
          </span>

          <button
            style={deleteBtn}
            onClick={(e) => deletePatient(p.patientID, e)}
          >
            ✖
          </button>
        </div>
      ))}
    </div>
  );
};

const sidebar = { padding:20, background:'#f4f4f4' };
const item = {
  padding:10,
  marginBottom:8,
  background:'#fff',
  cursor:'pointer',
  display:'flex',
  justifyContent:'space-between',
  alignItems:'center'
};
const deleteBtn = {
  background:'red',
  color:'#fff',
  border:'none',
  cursor:'pointer'
};

export default PatientList;

