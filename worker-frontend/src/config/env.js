// src/config/env.js

const getEnv = (key) => {
  const value = process.env[key];

  if (!value) {
    console.error(`❌ Missing environment variable: ${key}`);
  }

  return value;
};

export const ENV = {
  WORKER_REGISTER_URL: getEnv("REACT_APP_WORKER_REGISTER_URL"),
  WORKER_LOGIN_URL: getEnv("REACT_APP_WORKER_LOGIN_URL"),
  WORKER_STATUS_URL: getEnv("REACT_APP_WORKER_STATUS_URL"),
  WORKER_PROFILE_URL: getEnv("REACT_APP_WORKER_PROFILE_URL")
};
