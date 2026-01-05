import { useEffect, useState } from 'react';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import config from '../config';

// Icons
const greenIcon = new L.Icon({
  iconUrl: 'https://maps.gstatic.com/mapfiles/ms2/micons/green-dot.png',
  iconSize: [32, 32],
});

const redIcon = new L.Icon({
  iconUrl: 'https://maps.gstatic.com/mapfiles/ms2/micons/red-dot.png',
  iconSize: [32, 32],
});

const WorkerMap = ({ patient, onWorkersLoaded }) => {
  const [workers, setWorkers] = useState([]);

  useEffect(() => {
    if (!patient?.patientID) return;

    axios
      .get(
        `${config.API_BASE_URL}${config.ADMIN.MATCH_WORKERS(patient.patientID)}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      )
      .then(res => {
        setWorkers(res.data);
        onWorkersLoaded?.(res.data); // 🔑 expose workers
      })
      .catch(() => {
        setWorkers([]);
        onWorkersLoaded?.([]);
      });
  }, [patient, onWorkersLoaded]);

  const validWorkers = workers.filter(
    w => typeof w.latitude === 'number' && typeof w.longitude === 'number'
  );

  return (
    <div style={{ height: '100vh', width: '100%' }}>
      <MapContainer
        center={[20, 0]}
        zoom={2}
        minZoom={2}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {validWorkers.map(worker => (
          <Marker
            key={worker.workerID}
            position={[worker.latitude, worker.longitude]}
            icon={worker.status === 'available' ? greenIcon : redIcon}
          >
            <Popup maxWidth={300}>
              <strong>
                {worker.firstName} {worker.lastName}
              </strong>
              <hr />
              <p><b>Language:</b> {worker.spokenLanguage}</p>
              <p><b>Location:</b> {worker.city}, {worker.country}</p>
              <p>
                <b>Status:</b>{' '}
                <span style={{ color: worker.status === 'available' ? 'green' : 'red' }}>
                  {worker.status}
                </span>
              </p>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default WorkerMap;



