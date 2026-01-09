import { useEffect, useState } from 'react';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import config from '../config';

/* =====================
   ICONS
===================== */

const greenIcon = new L.Icon({
  iconUrl:
    'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
  shadowUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const redIcon = new L.Icon({
  iconUrl:
    'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
  shadowUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const blackIcon = new L.Icon({
  iconUrl:
    'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-black.png',
  shadowUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

/* =====================
   COMPONENT
===================== */

const GlobalMap = ({ appliedLanguage }) => {
  const [workers, setWorkers] = useState([]);
  const [patients, setPatients] = useState([]);

  /* =====================
     FETCH WORKERS
  ===================== */
  const fetchWorkers = () => {
    axios
      .get(`${config.API_BASE_URL}/admin/workers`, {
        params: appliedLanguage
          ? { language: appliedLanguage.toLowerCase() }
          : {},
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
      .then(res => setWorkers(res.data))
      .catch(() => {});
  };

  /* =====================
     FETCH PATIENTS
  ===================== */
  const fetchPatients = () => {
    axios
      .get(`${config.API_BASE_URL}/admin/patients-map`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
      .then(res => setPatients(res.data))
      .catch(() => {});
  };

  /* =====================
     AUTO REFRESH (POLLING)
  ===================== */
  useEffect(() => {
    fetchWorkers();
    fetchPatients();

    const workerInterval = setInterval(fetchWorkers, 5000); // every 5s
    const patientInterval = setInterval(fetchPatients, 10000); // every 10s

    return () => {
      clearInterval(workerInterval);
      clearInterval(patientInterval);
    };
  }, [appliedLanguage]);

  /* =====================
     VALID COORDINATES
  ===================== */
  const validWorkers = workers.filter(
    w => typeof w.latitude === 'number' && typeof w.longitude === 'number'
  );

  const validPatients = patients.filter(
    p => typeof p.latitude === 'number' && typeof p.longitude === 'number'
  );

  /* =====================
     RENDER
  ===================== */
  return (
    <MapContainer
      center={[20, 0]}
      zoom={2}
      minZoom={2}
      style={{ height: '100vh', width: '100%' }}
      scrollWheelZoom
    >
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* 🟢🔴 WORKERS */}
      {validWorkers.map(w => (
        <Marker
          key={w.workerID}
          position={[w.latitude, w.longitude]}
          icon={w.status === 'available' ? greenIcon : redIcon}
        >
          <Popup>
            <strong>{w.firstName} {w.lastName}</strong>
            <hr />
            <p><b>Language:</b> {w.spokenLanguage}</p>
            <p><b>Location:</b> {w.city}, {w.country}</p>
            <p><b>Phone:</b> {w.whatsapp}</p>
            <p><b>Rate:</b> ${w.rate}/hr</p>
            <p>
              <b>Status:</b>{' '}
              <span style={{ color: w.status === 'available' ? 'green' : 'red' }}>
                {w.status}
              </span>
            </p>
          </Popup>
        </Marker>
      ))}

      {/* ⚫ PATIENTS */}
      {validPatients.map(p => (
        <Marker
          key={p.patientID}
          position={[p.latitude + 0.02, p.longitude + 0.02]}
          icon={blackIcon}
        >
          <Popup>
            <strong>{p.firstName} {p.lastName}</strong>
            <hr />
            <p><b>Language:</b> {p.spokenLanguage}</p>
            <p><b>Location:</b> {p.city}, {p.country}</p>
            <p><b>Phone:</b> {p.whatsapp}</p>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default GlobalMap;







