import axios from 'axios';
import config from '../config';

const WorkerList = ({ workers, onDeleted }) => {
  const deleteWorker = async (workerID) => {
    if (!window.confirm('Delete this worker permanently?')) return;

    await axios.delete(
      `${config.API_BASE_URL}${config.ADMIN.DELETE_WORKER(workerID)}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      }
    );

    onDeleted();
  };

  return (
    <div style={panel}>
      <h3>Matched Workers</h3>

      {workers.map(w => (
        <div key={w.workerID} style={row}>
          <span>
            {w.firstName} {w.lastName}
          </span>

          <button
            style={deleteBtn}
            onClick={() => deleteWorker(w.workerID)}
          >
            ✖
          </button>
        </div>
      ))}
    </div>
  );
};

const panel = { padding:20, background:'#fff' };
const row = {
  display:'flex',
  justifyContent:'space-between',
  padding:8,
  borderBottom:'1px solid #ddd'
};
const deleteBtn = {
  background:'red',
  color:'#fff',
  border:'none',
  cursor:'pointer'
};

export default WorkerList;
