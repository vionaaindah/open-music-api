const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const { mapDBToModel } = require('../../utils');

class SongsService {
  constructor(cacheService) {
    this._pool = new Pool();
    this._cacheService = cacheService;
  }

  async addingSong({
    title,
    year,
    performer,
    genre,
    duration,
  }) {
    const id = `song-${nanoid(16)}`;
    const insertedAt = new Date().toISOString();

    const result = await this._pool.query(
      `INSERT INTO songs 
         VALUES($1, $2, $3, $4, $5, $6, $7, $7) 
         RETURNING id`,
      [
        id,
        title,
        year,
        performer,
        genre,
        duration,
        insertedAt,
      ],
    );

    if (!result.rows[0].id) {
      throw new InvariantError('Gagal menambahkan lagu');
    }

    await this._cacheService.del('songs');
    return result.rows[0].id;
  }

  async gettingAllSongs() {
    try {
      const result = await this._cacheService.get('songs');
      return JSON.parse(result);
    } catch (error) {
      const result = await this._pool.query(
        'SELECT id, title, performer FROM songs',
      );
      await this._cacheService.set('songs', JSON.stringify(result.rows), (60 * 30));
      return result.rows.map(mapDBToModel);
    }
  }

  async gettingSpecifiedSong(id) {
    const result = await this._pool.query(
      'SELECT * FROM songs WHERE id = $1',
      [id],
    );

    if (!result.rowCount) {
      throw new NotFoundError('Lagu tidak ditemukan, silahkan periksa kembali');
    }

    await this._cacheService.del('songs');
    return result.rows.map(mapDBToModel)[0];
  }

  async updateSong(id, {
    title,
    year,
    performer,
    genre,
    duration,
  }) {
    const updatedAt = new Date().toISOString();

    const result = await this._pool.query(
      `UPDATE songs SET 
      title = $1, 
      year = $2, 
      performer = $3, 
      genre = $4, 
      duration = $5, 
      updatedat = $6 
      WHERE id = $7 RETURNING id`,
      [
        title,
        year,
        performer,
        genre,
        duration,
        updatedAt,
        id,
      ],
    );

    if (!result.rowCount) {
      throw new NotFoundError('ID tidak ditemukan, tidak dapat memperbarui lagu');
    }

    await this._cacheService.del('songs');
  }

  async deleteSong(id) {
    const result = await this._pool.query(
      'DELETE FROM songs WHERE id = $1 RETURNING id',
      [id],
    );

    if (!result.rowCount) {
      throw new NotFoundError('ID tidak ditemukan, tidak dapat menghapus lagu');
    }

    await this._cacheService.del('songs');
  }
}

module.exports = SongsService;
