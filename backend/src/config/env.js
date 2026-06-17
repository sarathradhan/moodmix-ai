import dotenv from 'dotenv';

dotenv.config();

export const env = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT || '5000', 10),
  DATABASE_URL:
    process.env.DATABASE_URL ||
    'postgresql://postgres:postgres@localhost:5432/moodmix',
  ML_SERVICE_URL: process.env.ML_SERVICE_URL || 'http://localhost:8000',
  USE_ML_SERVICE: process.env.USE_ML_SERVICE !== 'false',
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://127.0.0.1:5173',
  SESSION_SECRET: process.env.SESSION_SECRET || 'dev-secret',
};
