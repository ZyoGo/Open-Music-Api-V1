import pkg from 'pg';
import { nanoid } from 'nanoid';
import bcrypt from 'bcrypt';
import InvariantError from '../../exceptions/InvariantError';
import AuthenticationError from '../../exceptions/AuthenticationError';

const { Pool } = pkg;

class UsersService {
  constructor() {
    // eslint-disable-next-line no-underscore-dangle
    this._pool = new Pool();
  }

  async addUser({ username, password, fullname }) {
    await this.verifyNewUsername(username)

    const id = `user-${nanoid(16)}`;
    const hashedPassword = await bcrypt.hash(password, 10);

    const query = {
      text: 'INSERT INTO users VALUES ($1, $2, $3, $4) RETURNING id',
      values: [id, username, hashedPassword, fullname],
    };

    // eslint-disable-next-line no-underscore-dangle
    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError('User gagal ditambahkan');
    }

    return result.rows[0].id;
  }

  async verifyNewUsername(username) {
    const query = {
      text: 'SELECT username FROM users WHERE username = $1',
      values: [username],
    };

    // eslint-disable-next-line no-underscore-dangle
    const result = await this._pool.query(query);

    if (result.rows.length > 0) {
      throw new InvariantError('Gagal menambahkan user. Username sudah digunakan.');
    }
  }

  async verifyUserCredential(username, password) {
    const query = {
      text: 'SELECT id, password FROM users WHERE username = $1',
      values: [username],
    };

    // eslint-disable-next-line no-underscore-dangle
    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new AuthenticationError('Credential yang anda berikan salah');
    }

    const { id, password: hashedPassword } = result.rows[0];

    const match = await bcrypt.compare(password, hashedPassword);

    if (!match) {
      throw new AuthenticationError('Credential yang ada berikan salah');
    }

    return id;
  }

  async getUsersByUsername(username) {
    const query = {
      text: 'SELECT id, username, fullname FROM users WHERE username LIKE $1',
      values: [`%${username}%`],
    };

    // eslint-disable-next-line no-underscore-dangle
    const result = await this._pool.query(query);
    return result;
  }
}

export default UsersService;
