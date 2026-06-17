import { connectDatabase } from './config/database.js';
import { env } from './config/env.js';
import logger from './utils/logger.js';

const start = async () => {
  try {
    await connectDatabase();
    const { default: app } = await import('./app.js');
    app.listen(env.PORT, () => {
      logger.info(`MoodMix API listening on port ${env.PORT}`);
    });
  } catch (err) {
    logger.error('Failed to start server', err);
    process.exit(1);
  }
};

start();
