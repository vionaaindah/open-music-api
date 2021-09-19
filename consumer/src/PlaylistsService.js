const { Pool } = require('pg');

class PlaylistsService {
  constructor() {
    this._pool = new Pool();
  }

  async getPlaylists(playlistId) {
    const result = await this._pool.query(
      `SELECT songs.title, songs.year, songs.performer, songs.genre, songs.duration FROM songs
        LEFT JOIN playlistsongs ON songs.id = playlistsongs.song_id
        WHERE playlistsongs.playlist_id = $1`,
      [playlistId],
    );
    return result.rows;
  }
}

module.exports = PlaylistsService;
