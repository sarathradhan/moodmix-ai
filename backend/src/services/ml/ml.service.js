import axios from 'axios';
import { env } from '../../config/env.js';
import logger from '../../utils/logger.js';
import { detectEmotionsFromText } from '../mood/emotion.stub.js';
import { normalizeMlPredictions } from './mlLabel.mapper.js';

const client = axios.create({
  baseURL: env.ML_SERVICE_URL,
  timeout: 60000, // model inference can be slow on first request
});

/** Calls Python ML service POST /predict — returns raw API body */
export async function callMlPredict(text) {
  const { data } = await client.post('/predict', { text });
  return data;
}

/**
 * Phase 3 — emotion prediction with ML primary, stub fallback.
 * @returns {{ emotions, primary, scores, source: 'ml'|'stub', mlPredictions? }}
 */
export async function getEmotionPrediction(text) {
  if (env.USE_ML_SERVICE) {
    try {
      const data = await callMlPredict(text);
      const normalized = normalizeMlPredictions(data.predictions);
      logger.info(`Emotions from ML service (primary: ${normalized.primary})`);
      return { ...normalized, source: 'ml' };
    } catch (err) {
      logger.warn(
        `ML service unavailable (${env.ML_SERVICE_URL}), using stub fallback:`,
        err.message
      );
    }
  }

  const stub = detectEmotionsFromText(text);
  return {
    ...stub,
    source: 'stub',
    mlPredictions: null,
  };
}
