const { nanoid } = require('nanoid');
const { Pool } = require('pg');

const InvariantError = require('../../exceptions/InvariantError');

class CollaborationsService {
  constructor() {
    this._pool = new Pool();
  }

  async addingCollaboration(playlistId, userId) {
    const id = `collab-${nanoid(16)}`;

    const result = await this._pool.query(
      'INSERT INTO collaborations VALUES($1, $2, $3) RETURNING id',
      [
        id,
        playlistId,
        userId,
      ],
    );

    if (!result.rowCount) {
      throw new InvariantError('Tidak dapat menambahkan kolaborasi');
    }
    return result.rows[0].id;
  }

  async deleteCollaboration(playlistId, userId) {
    const result = await this._pool.query(
      `DELETE FROM collaborations 
      WHERE playlist_id = $1 AND user_id = $2 
      RETURNING id`,
      [
        playlistId,
        userId,
      ],
    );

    if (!result.rowCount) {
      throw new InvariantError('Tidak dapat menghapus kolaborasi');
    }
  }

  async verifyCollaborator(playlistId, userId) {
    const result = await this._pool.query(
      `SELECT * FROM playlistsongs 
      WHERE user_id = $1 AND playlist_id = $2`,
      [
        userId,
        playlistId,
      ],
    );

    if (!result.rowCount) {
      throw new InvariantError('Lagu gagal diverifikasi');
    }
  }
}

module.exports = CollaborationsService;
