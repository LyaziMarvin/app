import { useState } from 'react';
import GlobalMap from './workerMap';

const AdminDashboard = () => {
  const [inputLanguage, setInputLanguage] = useState('');
  const [activeLanguageFilter, setActiveLanguageFilter] = useState('');

  const applyFilter = () => {
    setActiveLanguageFilter(inputLanguage.trim());
  };

  const clearFilter = () => {
    setInputLanguage('');
    setActiveLanguageFilter('');
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr' }}>
      <div style={sidebar}>
        <h3>Filter Remote Workers</h3>

        <input
          placeholder="Enter language (e.g English)"
          value={inputLanguage}
          onChange={e => setInputLanguage(e.target.value)}
          style={input}
        />

        <button style={btn} onClick={applyFilter}>
          Apply Filter
        </button>

        <button style={clearBtn} onClick={clearFilter}>
          Clear Filter
        </button>
      </div>

      <GlobalMap languageFilter={activeLanguageFilter} />
    </div>
  );
};

const sidebar = {
  padding: 20,
  background: '#f4f4f4',
  display: 'flex',
  flexDirection: 'column',
  gap: '10px'
};

const input = {
  width: '100%',
  padding: '8px'
};

const btn = {
  padding: '10px',
  background: '#007bff',
  color: '#fff',
  border: 'none',
  cursor: 'pointer'
};

const clearBtn = {
  padding: '10px',
  background: '#666',
  color: '#fff',
  border: 'none',
  cursor: 'pointer'
};

export default AdminDashboard;

