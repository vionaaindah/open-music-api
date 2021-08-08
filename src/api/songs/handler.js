/* eslint no-underscore-dangle: ["error", { "allowAfterThis": true }] */

class SongsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.addingSongHandler = this.addingSongHandler.bind(this);
    this.gettingAllSongsHandler = this.gettingAllSongsHandler.bind(this);
    this.gettingSpecifiedSongHandler = this.gettingSpecifiedSongHandler.bind(this);
    this.updateSongHandler = this.updateSongHandler.bind(this);
    this.deleteSonghandler = this.deleteSongHandler.bind(this);
  }

  async addingSongHandler(request, h) {
    this._validator.validateSongPayload(request.payload);
    const {
      title,
      year,
      performer,
      genre,
      duration,
    } = request.payload;

    const songId = await this._service.addingSong({
      title,
      year,
      performer,
      genre,
      duration,
    });

    const response = h.response({
      status: 'success',
      message: 'Lagu berhasil ditambahkan',
      data: {
        songId,
      },
    });
    response.code(201);
    return response;
  }

  async gettingAllSongsHandler() {
    const songs = await this._service.gettingAllSongs();
    return {
      status: 'success',
      data: {
        songs,
      },
    };
  }

  async gettingSpecifiedSongHandler(request) {
    const { id } = request.params;
    const song = await this._service.gettingSpecifiedSong(id);
    return {
      status: 'success',
      data: {
        song,
      },
    };
  }

  async updateSongHandler(request) {
    this._validator.validateSongPayload(request.payload);

    const {
      title,
      year,
      performer,
      genre,
      duration,
    } = request.payload;

    const { id } = request.params;

    await this._service.updateSong(id, {
      title,
      year,
      performer,
      genre,
      duration,
    });

    return {
      status: 'success',
      message: 'lagu berhasil diperbarui',
    };
  }

  async deleteSongHandler(request) {
    const { id } = request.params;
    await this._service.deleteSong(id);

    return {
      status: 'success',
      message: 'lagu berhasil dihapus',
    };
  }
}

module.exports = SongsHandler;
