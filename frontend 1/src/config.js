const Env = {
  API_BASE_URL: process.env.REACT_APP_API_BASE_URL,

  PATIENT_LOGIN:
    process.env.REACT_APP_API_BASE_URL +
    process.env.REACT_APP_PATIENT_LOGIN,

  PATIENT_REGISTER:
    process.env.REACT_APP_API_BASE_URL +
    process.env.REACT_APP_PATIENT_REGISTER,

  PATIENT_PROFILE:
    process.env.REACT_APP_API_BASE_URL +
    process.env.REACT_APP_PATIENT_PROFILE
};

export default Env;