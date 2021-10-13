import pkg from 'pg';
import InvariantError from '../../exceptions/InvariantError';

const { Pool } = pkg;

class AuthenticationsService {
  constructor() {
    this._pool = new Pool();
  }

  async addRefreshToken(jwt_token) {
    const query = {
      text: 'INSERT INTO authentications VALUES($1)',
      values: [jwt_token],
    };

    await this._pool.query(query);
  }

  async verifyRefreshToken(jwt_token) {
    const query = {
      text: 'SELECT jwt_token FROM authentications WHERE jwt_token = $1',
      values: [jwt_token],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError('Refresh token tidak valid');
    }
  }

  async deleteRefreshToken(jwt_token) {
    await this.verifyRefreshToken(jwt_token);

    const query = {
      text: 'DELETE FROM authentications WHERE jwt_token = $1',
      values: [jwt_token],
    };

    await this._pool.query(query);
  }
}

export default AuthenticationsService;
