import { getPool } from '../config/database.js';
import { mapUserRow } from '../utils/rowMapper.js';

/** Email/password user — PostgreSQL data access */
const User = {
  toPublic(user) {
    if (!user) return null;
    return {
      id: user.id,
      email: user.email,
      displayName: user.displayName,
      createdAt: user.createdAt,
    };
  },

  async findById(id) {
    const { rows } = await getPool().query('SELECT * FROM users WHERE id = $1', [id]);
    return rows[0] ? mapUserRow(rows[0]) : null;
  },

  async findByEmail(email) {
    const { rows } = await getPool().query('SELECT * FROM users WHERE email = $1', [
      email.toLowerCase(),
    ]);
    return rows[0] ? mapUserRow(rows[0]) : null;
  },

  async create({ email, passwordHash, displayName }) {
    const { rows } = await getPool().query(
      `INSERT INTO users (email, password_hash, display_name)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [email, passwordHash, displayName ?? null]
    );
    return mapUserRow(rows[0]);
  },
};

export default User;
