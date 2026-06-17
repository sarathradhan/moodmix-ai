import * as moodService from '../services/mood/mood.service.js';
import { validateMoodText } from '../validators/mood.validator.js';

/** POST /api/v1/mood — analyze mood, return playlists, persist history for session user */
export async function analyzeMood(req, res, next) {
  try {
    const { text } = req.body;
    const validation = validateMoodText(text);
    if (!validation.valid) {
      return res.status(400).json({ error: validation.error });
    }

    const result = await moodService.processMoodText(text.trim(), req.userId);
    res.json(result);
  } catch (err) {
    next(err);
  }
}