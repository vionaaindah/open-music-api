const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const { mapDBToModel } = require('../../utils');

class SongsService {
    constructor() {
        this._pool = new Pool();
    }
    
    async addingSong({
        title,
        year,
        performer,
        genre,
        duration,
    }) 
    {

        const id = `song-${nanoid(16)}`;
        const insertedAt = new Date().toISOString();
        const updatedAt = insertedAt;

        const result = await this._pool.query(
            'INSERT INTO songs VALUES($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id',
            [
                id,
                title,
                year,
                performer,
                genre,
                duration,
                insertedAt,
                updatedAt
            ]
        );

        if (!result.rows[0].id) {
            throw new InvariantError('Lagu gagal ditambahkan');
        }

        return result.rows[0].id;
    }

    async gettingAllSongs() {
        const result = await this._pool.query(
            'SELECT id, title, performer FROM songs'
        );
        return result.rows.map(mapDBToModel);
    }

    async gettingSpecifiedSong(id) {

        const result = await this._pool.query(
            'SELECT * FROM songs WHERE id = $1',
            [id]
        );

        if (!result.rows.length) {
            throw new NotFoundError('Lagu tidak ditemukan');
        }

        return result.rows.map(mapDBToModel)[0];
    }

    async updateSong(id, {
        title,
        year,
        performer,
        genre,
        duration,
    }) 
    {
        const updatedAt = new Date().toISOString();

        const result = await this._pool.query(
            'UPDATE songs SET title = $1, year = $2, performer = $3, genre = $4, duration = $5, updated_at = $6 WHERE id = $7 RETURNING id',
            [
                title,
                year,
                performer,
                genre,
                duration,
                updatedAt,
                id
            ],
        );

        if (!result.rows.length) {
            throw new NotFoundError('Gagal memperbarui lagu. Id tidak ditemukan');
        }
    }

    async deleteSong(id) {

        const result = await this._pool.query(
            'DELETE FROM songs WHERE id = $1 RETURNING id', 
            [id]
        );

        if (!result.rows.length) {
            throw new NotFoundError('Gagal menghapus lagu. Id tidak ditemukan');
        }
    }
}

module.exports = SongsService;
