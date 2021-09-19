class PlaylistHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.addingPlaylistHandler = this.addingPlaylistHandler.bind(this);
    this.gettingAllPlaylistsHandler = this.gettingAllPlaylistsHandler.bind(this);
    this.deletePlaylistHandler = this.deletePlaylistHandler.bind(this);
    this.addingPlaylistSongHandler = this.addingPlaylistSongHandler.bind(this);
    this.gettingAllPlaylistSongsHandler = this.gettingAllPlaylistSongsHandler.bind(this);
    this.deletePlaylistSongHandler = this.deletePlaylistSongHandler.bind(this);
  }

  async addingPlaylistHandler(request, h) {
    this._validator.validatePlaylistPayloadSchema(request.payload);
    const { id: credentialId } = request.auth.credentials;
    const { name } = request.payload;

    const playlistId = await this._service.addingPlaylist({
      name,
      owner: credentialId,
    });

    const response = h.response({
      status: 'success',
      message: 'Playlist berhasil ditambahkan',
      data: {
        playlistId,
      },
    });
    response.code(201);
    return response;
  }

  async gettingAllPlaylistsHandler(request) {
    const { id: credentialId } = request.auth.credentials;
    const playlistdata = await this._service.gettingAllPlaylists(credentialId);

    return {
      status: 'success',
      data: {
        playlists: playlistdata,
      },
    };
  }

  async deletePlaylistHandler(request) {
    const { id: credentialId } = request.auth.credentials;
    const { playlistId } = request.params;

    await this._service.verifyPlaylistOwner(playlistId, credentialId);
    await this._service.deletePlaylist(playlistId, credentialId);

    return {
      status: 'success',
      message: 'Playlist berhasil dihapus',
    };
  }

  async addingPlaylistSongHandler(request, h) {
    this._validator.validatePlaylistSongPayloadSchema(request.payload);

    const { songId } = request.payload;
    const { playlistId } = request.params;
    const { id: credentialId } = request.auth.credentials;

    await this._service.verifyPlaylistAccess(playlistId, credentialId);
    await this._service.addingPlaylistSong(songId, playlistId);

    const response = h.response({
      status: 'success',
      message: 'Lagu berhasil ditambahkan ke playlist',
    });

    response.code(201);
    return response;
  }

  async gettingAllPlaylistSongsHandler(request) {
    const { playlistId } = request.params;
    const { id: credentialId } = request.auth.credentials;

    await this._service.verifyPlaylistAccess(playlistId, credentialId);

    const songs = await this._service.gettingAllPlaylistSongs(playlistId);

    const songsdata = songs.map((playlistsong) => ({
      id: playlistsong.id,
      title: playlistsong.title,
      performer: playlistsong.performer,
    }));

    return {
      status: 'success',
      data: {
        songs: songsdata,
      },
    };
  }

  async deletePlaylistSongHandler(request) {
    this._validator.validatePlaylistSongPayloadSchema(request.payload);
    const { playlistId } = request.params;
    const { songId } = request.payload;
    const { id: credentialId } = request.auth.credentials;

    await this._service.verifyPlaylistAccess(playlistId, credentialId);
    await this._service.deletePlaylistSong(songId, playlistId);

    return {
      status: 'success',
      message: 'Lagu berhasil dihapus dari playlist',
    };
  }
}

module.exports = PlaylistHandler;
