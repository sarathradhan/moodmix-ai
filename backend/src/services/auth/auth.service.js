import bcrypt from 'bcryptjs';
import User from '../../models/User.model.js';
import { ApiError } from '../../utils/ApiError.js';

const SALT_ROUNDS = 10;

export async function signUp({ email, password, displayName }) {
  const normalizedEmail = email.trim().toLowerCase();

  const existing = await User.findByEmail(normalizedEmail);
  if (existing) {
    throw new ApiError(409, 'An account with this email already exists');
  }

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
  const user = await User.create({
    email: normalizedEmail,
    passwordHash,
    displayName: displayName?.trim() || normalizedEmail.split('@')[0],
  });

  return User.toPublic(user);
}

export async function logIn({ email, password }) {
  const normalizedEmail = email.trim().toLowerCase();
  const user = await User.findByEmail(normalizedEmail);

  if (!user) {
    throw new ApiError(401, 'Invalid email or password');
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    throw new ApiError(401, 'Invalid email or password');
  }

  return User.toPublic(user);
}
