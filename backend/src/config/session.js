import session from 'express-session';
import connectPgSimple from 'connect-pg-simple';
import { env } from './env.js';
import { getPool, isDatabaseConnected } from './database.js';

const PgSession = connectPgSimple(session);

const SESSION_OPTS = {
  secret: env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  name: 'moodmix.sid',
  cookie: {
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: 'lax',
    secure: env.NODE_ENV === 'production',
  },
};

/** Session middleware — PostgreSQL store when DB is connected */
export function sessionMiddleware() {
  if (isDatabaseConnected()) {
    return session({
      ...SESSION_OPTS,
      store: new PgSession({
        pool: getPool(),
        tableName: 'session',
        createTableIfMissing: true,
      }),
    });
  }

  return session(SESSION_OPTS);
}
