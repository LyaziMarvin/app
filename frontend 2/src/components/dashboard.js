import { useState } from 'react';
import GlobalMap from './workerMap';

const AdminDashboard = () => {
  const [languageInput, setLanguageInput] = useState('');
  const [appliedLanguage, setAppliedLanguage] = useState(null);

  const applyFilter = () => {
    if (languageInput.trim() === '') return;
    setAppliedLanguage(languageInput.trim());
  };

  const clearFilter = () => {
    setLanguageInput('');
    setAppliedLanguage(null);
  };

  return (
    <div style={layout}>
      {/* ===== LEFT SIDEBAR ===== */}
      <div style={sidebar}>
        <h3 style={title}>Filter Workers</h3>

        <input
          type="text"
          placeholder="Language (e.g. English)"
          value={languageInput}
          onChange={e => setLanguageInput(e.target.value)}
          style={input}
        />

        <button style={btnPrimary} onClick={applyFilter}>
          Apply Filter
        </button>

        <button style={btnSecondary} onClick={clearFilter}>
          Clear Filter
        </button>
      </div>

      {/* ===== MAP ===== */}
      <div style={mapContainer}>
        <GlobalMap appliedLanguage={appliedLanguage} />
      </div>
    </div>
  );
};

/* =====================
   STYLES
===================== */

const layout = {
  display: 'grid',
  gridTemplateColumns: '260px 1fr',
  height: '100vh',
};

const sidebar = {
  padding: '20px',
  background: '#f4f4f4',
  borderRight: '1px solid #ddd',
};

const title = {
  marginBottom: '15px',
};

const input = {
  width: '100%',
  padding: '10px',
  marginBottom: '10px',
  fontSize: '14px',
};

const btnPrimary = {
  width: '100%',
  padding: '10px',
  background: '#007bff',
  color: '#fff',
  border: 'none',
  cursor: 'pointer',
  marginBottom: '10px',
};

const btnSecondary = {
  width: '100%',
  padding: '10px',
  background: '#6c757d',
  color: '#fff',
  border: 'none',
  cursor: 'pointer',
};

const mapContainer = {
  height: '100vh',
};

export default AdminDashboard;



