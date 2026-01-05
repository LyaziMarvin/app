import { useState } from 'react';
import PatientList from './patientList';
import WorkerMap from './workerMap';
import WorkerList from './workerList';

const AdminDashboard = () => {
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [workers, setWorkers] = useState([]);

  return (
    <div style={layout}>
      <PatientList onSelect={setSelectedPatient} />

      <div>
        {selectedPatient && (
          <>
            <WorkerMap
              patient={selectedPatient}
              onWorkersLoaded={setWorkers}
            />

            <WorkerList
              workers={workers}
              onDeleted={() => setSelectedPatient({ ...selectedPatient })}
            />
          </>
        )}
      </div>
    </div>
  );
};

const layout = {
  display: 'grid',
  gridTemplateColumns: '350px 1fr',
  height: '100vh'
};

export default AdminDashboard;


