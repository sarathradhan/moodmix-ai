import { isDatabaseConnected } from '../../config/database.js';
import MoodHistory from '../../models/MoodHistory.model.js';
import PlaylistHistory from '../../models/PlaylistHistory.model.js';
import { getEmotionPrediction } from '../ml/ml.service.js';
import { mapEmotionsToKeywords } from './emotion.mapper.js';
import { getRecommendationsForMood } from '../music/musicRecommendations.service.js';

/** Full mood pipeline: ML emotions → genres + songs → save history for user */
export async function processMoodText(text, userId) {
  const prediction = await getEmotionPrediction(text);
  const keywords = mapEmotionsToKeywords(prediction.emotions);

  const music = await getRecommendationsForMood({
    primary: prediction.primary,
    emotions: prediction.emotions,
  });

  const result = {
    text,
    emotions: prediction.emotions,
    primary: prediction.primary,
    spotifyKeywords: keywords,
    genres: music.genres,
    musicSource: music.musicSource,
    musicMessage: music.musicMessage ?? null,
    emotionSource: prediction.source,
    mlPredictions: prediction.mlPredictions ?? null,
  };

  if (isDatabaseConnected() && userId) {
    const moodEntry = await MoodHistory.create({
      userId,
      text,
      emotions: prediction.emotions,
      primaryEmotion: prediction.primary,
      spotifyKeywords: keywords,
    });

    await PlaylistHistory.create({
      userId,
      moodHistoryId: moodEntry.id,
      playlists: { genres: music.genres },
    });

    result.historyId = moodEntry.id;
  }

  return result;
}
