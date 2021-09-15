const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const AuthorizationError = require('../../exceptions/AuthorizationError');
const { mapDBToModel } = require('../../utils');

class PlaylistsService {
  constructor(collaborationService) {
    this._pool = new Pool();
    this._collaborationService = collaborationService;
  }

  async addingPlaylist({
    name,
    owner,
  }) {
    const id = `playlist-${nanoid(16)}`;

    const result = await this._pool.query(
      'INSERT INTO playlists VALUES($1, $2, $3) RETURNING id',
      [
        id,
        name,
        owner,
      ],
    );

    if (!result.rows[0].id) {
      throw new InvariantError('Gagal menambahkan playlist');
    }

    return result.rows[0].id;
  }

  async gettingAllPlaylists(owner) {
    const result = await this._pool.query(
      `SELECT playlists.id, playlists.name, users.username
      FROM playlists
      LEFT JOIN collaborations ON collaborations.playlist_id = playlists.id
      INNER JOIN users ON playlists.owner = users.id
      WHERE playlists.owner = $1 OR collaborations.user_id = $1
      GROUP BY playlists.id, users.id`,
      [owner],
    );

    return result.rows.map(mapDBToModel);
  }

  async deletePlaylist(playlistId) {
    const result = await this._pool.query(
      'DELETE FROM playlists WHERE id = $1 RETURNING id',
      [playlistId],
    );

    if (!result.rowCount) {
      throw new NotFoundError('ID tidak ditemukan, tidak dapat menghapus playlist');
    }
  }

  async verifyPlaylistOwner(playlistId, userId) {
    const result = await this._pool.query(
      'SELECT owner FROM playlists WHERE id = $1',
      [playlistId],
    );

    if (!result.rowCount) {
      throw new NotFoundError('Playlist tidak ditemukan');
    }

    const playlist = result.rows[0];
    if (playlist.owner !== userId) {
      throw new AuthorizationError('Anda tidak mempunyai akses. Atas resource ini...');
    }
  }

  async addingPlaylistSong(songId, playlistId) {
    const id = `playlistsong-${nanoid(16)}`;

    const result = await this._pool.query(
      'INSERT INTO playlistsongs VALUES($1, $2, $3) RETURNING id',
      [
        id,
        playlistId,
        songId,
      ],
    );

    if (!result.rowCount) {
      throw new InvariantError('Lagu gagal ditambahkan ke playlist');
    }
  }

  async gettingAllPlaylistSongs(id) {
    const result = await this._pool.query(
      `SELECT playlistsongs.*, songs.title, songs.performer 
      FROM playlistsongs 
      LEFT JOIN songs ON songs.id = playlistsongs.song_id 
      WHERE playlistsongs.playlist_id = $1`,
      [id],
    );

    if (!result.rowCount) {
      throw new NotFoundError('Playlist tidak ditemukan');
    }
    return result.rows.map(mapDBToModel);
  }

  async deletePlaylistSong(songId, playlistId) {
    const result = await this._pool.query(
      `DELETE FROM playlistsongs 
      WHERE song_id = $1 AND playlist_id = $2 
      RETURNING id`,
      [
        songId,
        playlistId,
      ],
    );

    if (!result.rowCount) {
      throw new InvariantError(
        'ID tidak ditemukan, tidak dapat menghapus lagu dalam playlist',
      );
    }
  }

  async verifyPlaylistAccess(playlistId, userId) {
    try {
      await this.verifyPlaylistOwner(playlistId, userId);
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      try {
        await this._collaborationService.verifyCollaborator(playlistId, userId);
      } catch {
        throw error;
      }
    }
  }
}

module.exports = PlaylistsService;
