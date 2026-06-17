import * as authService from '../services/auth/auth.service.js';
import User from '../models/User.model.js';
import { validateSignUp, validateLogin } from '../validators/auth.validator.js';

/** POST /api/v1/auth/signup */
export async function signup(req, res, next) {
  try {
    const validation = validateSignUp(req.body);
    if (!validation.valid) {
      return res.status(400).json({ error: validation.error });
    }

    const user = await authService.signUp(req.body);

    req.session.userId = user.id;
    res.status(201).json({ user });
  } catch (err) {
    next(err);
  }
}

/** POST /api/v1/auth/login */
export async function login(req, res, next) {
  try {
    const validation = validateLogin(req.body);
    if (!validation.valid) {
      return res.status(400).json({ error: validation.error });
    }

    const user = await authService.logIn(req.body);

    req.session.userId = user.id;
    res.json({ user });
  } catch (err) {
    next(err);
  }
}

/** GET /api/v1/auth/me */
export async function me(req, res, next) {
  try {
    const userId = req.session?.userId;
    if (!userId) {
      return res.json({ user: null });
    }

    const user = await User.findById(userId);
    res.json({ user: user ? User.toPublic(user) : null });
  } catch (err) {
    next(err);
  }
}

/** POST /api/v1/auth/logout */
export function logout(req, res, next) {
  req.session.destroy((err) => {
    if (err) return next(err);
    res.clearCookie('moodmix.sid');
    res.json({ message: 'Logged out' });
  });
}
