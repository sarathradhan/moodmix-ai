/** Request validation for mood endpoints (expand with zod/joi later) */
export function validateMoodText(text) {
  if (!text || typeof text !== 'string' || !text.trim()) {
    return { valid: false, error: 'Mood text must be a non-empty string' };
  }
  if (text.length > 500) {
    return { valid: false, error: 'Mood text must be 500 characters or less' };
  }
  return { valid: true };
}
