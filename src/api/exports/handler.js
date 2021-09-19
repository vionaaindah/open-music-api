class ExportsHandler {
  constructor({ ProducerService, playlistsService, validator }) {
    this._ProducerService = ProducerService;
    this._playlistsService = playlistsService;
    this._validator = validator;

    this.ExportSongsHandler = this.ExportSongsHandler.bind(this);
  }

  async ExportSongsHandler(request, h) {
    this._validator.validateExportSongsPayload(request.payload);

    const { playlistId } = request.params;
    const { id: userId } = request.auth.credentials;

    await this._playlistsService.verifyPlaylistAccess(playlistId, userId);

    const message = {
      playlistId,
      targetEmail: request.payload.targetEmail,
    };

    await this._ProducerService.sendMessage('export:playlists', JSON.stringify(message));

    const response = h.response({
      status: 'success',
      message: 'Permintaan Anda sedang kami proses',
    });

    response.code(201);
    return response;
  }
}

module.exports = ExportsHandler;
