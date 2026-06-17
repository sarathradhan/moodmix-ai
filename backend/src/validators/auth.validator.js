const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateSignUp({ email, password, displayName }) {
  if (!email?.trim()) return { valid: false, error: 'Email is required' };
  if (!EMAIL_RE.test(email.trim())) return { valid: false, error: 'Invalid email address' };
  if (!password || password.length < 8) {
    return { valid: false, error: 'Password must be at least 8 characters' };
  }
  if (displayName && displayName.length > 100) {
    return { valid: false, error: 'Display name is too long' };
  }
  return { valid: true };
}

export function validateLogin({ email, password }) {
  if (!email?.trim()) return { valid: false, error: 'Email is required' };
  if (!password) return { valid: false, error: 'Password is required' };
  return { valid: true };
}
