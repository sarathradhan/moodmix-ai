import { ApiError } from '../utils/ApiError.js';

/** Require a logged-in session (userId on req.session) */
export function requireAuth(req, _res, next) {
  if (!req.session?.userId) {
    return next(new ApiError(401, 'You must be logged in'));
  }
  req.userId = req.session.userId;
  next();
}
