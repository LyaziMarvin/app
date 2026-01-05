const config = {
  API_BASE_URL: process.env.REACT_APP_API_BASE_URL,

  ADMIN: {
    LOGIN: '/admin/login',
    REGISTER: '/admin/register',
    PATIENTS: '/admin/patients',
    MATCH_WORKERS: (patientID) => `/admin/match-workers/${patientID}`,
    DELETE_PATIENT: (patientID) => `/admin/patient/${patientID}`,
    DELETE_WORKER: (workerID) => `/admin/worker/${workerID}`
  }
};

export default config;
