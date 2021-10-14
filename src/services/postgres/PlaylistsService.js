import pkg from 'pg';
import { nanoid } from 'nanoid';
// eslint-disable-next-line import/named
import { mapDBToPlaylist } from '../../utils';
import InvariantError from '../../exceptions/InvariantError';
import NotFoundError from '../../exceptions/NotFoundError';
import AuthorizationError from '../../exceptions/AuthorizationError';

const { Pool } = pkg;

class PlaylistsService {
  constructor(collaborationService) {
    this._pool = new Pool();
    this._collaborationService = collaborationService;
  }

  async addPlaylist({
    name,
    owner,
  }) {
    const id = `playlist-${nanoid(16)}`;

    const query = {
      text: 'INSERT INTO playlists VALUES($1, $2, $3) RETURNING id',
      values: [id, name, owner],
    };

    console.log(owner);

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('Playlist gagal ditambahkan');
    }

    return result.rows[0].id;
  }

  async getPlaylist(owner) {
    const query = {
      text: `SELECT playlists.*, users.username FROM playlists
             LEFT JOIN collaborations ON collaborations.playlist_id = playlists.id 
             LEFT JOIN users ON users.id = playlists.owner 
             WHERE playlists.owner = $1 OR collaborations.user_id = $1`,
      values: [owner],
    };

    const result = await this._pool.query(query);

    return result.rows.map(mapDBToPlaylist);
  }

  async getPlaylistById(id) {
    const query = {
      text: `SELECT playlists.*, users.username FROM playlists
             LEFT JOIN users ON users.id = playlists.owner
             WHERE playlists.id = $1`,
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Playlist tidak ditemukan');
    }

    return result.rows.map(mapDBToPlaylist)[0];
  }

  async editPlaylistById(id, { name }) {
    const query = {
      text: 'UPDATE playlists SET name = $1, WHERE id = $2 RETURNING id',
      values: [name, id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Gagal memperbarui playlist. Id tidak ditemukan');
    }
  }

  async deletePLaylistById(id) {
    const query = {
      text: 'DELETE FROM playlists WHERE id = $1 RETURNING id',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Playlist gagal dihapus. Id tidak ditemukan');
    }
  }

  async verifyPlaylistOwner(id, owner) {
    const verifyQuery = {
      text: 'SELECT owner FROM playlists WHERE id = $1',
      values: [id],
    };

    const verifyResult = await this._pool.query(verifyQuery);

    if (!verifyResult.rowCount) {
      throw new NotFoundError('Playlist tidak ditemukan');
    }
    const playlist = verifyResult.rows[0];
    if (playlist.owner !== owner) {
      throw new AuthorizationError('Anda tidak berhak mengakses resource ini');
    }
  }

  async verifyPlaylistAccess(id, userId) {
    try {
      await this.verifyPlaylistOwner(id, userId);
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      try {
        await this._collaborationService.verifyFromCollaborator(id, userId);
      } catch {
        throw error;
      }
    }
  }
}

export default PlaylistsService;
