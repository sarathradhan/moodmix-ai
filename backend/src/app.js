import express from 'express';
import cors from 'cors';
import { env } from './config/env.js';
import { sessionMiddleware } from './config/session.js';
import apiRoutes from './routes/index.js';
import { errorHandler } from './middleware/errorHandler.js';
import { requestLogger } from './middleware/requestLogger.js';

const app = express();

app.use(
  cors(
    env.NODE_ENV === 'production'
      ? { origin: env.FRONTEND_URL, credentials: true }
      : { origin: true, credentials: true }
  )
);
app.use(express.json());
app.use(sessionMiddleware());
app.use(requestLogger);

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'moodmix-backend' });
});

app.use('/api/v1', apiRoutes);

app.use(errorHandler);

export default app;
