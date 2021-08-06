const ClientError = require('../../exceptions/ClientError');

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

    errorHandler = (error, h) => {
        if (error instanceof ClientError) {
            const response = h.response({
                status: 'fail',
                message: error.message,
            });
            response.code(error.statusCode);
            return response;
        }

        const response = h.response({
            status: 'error',
            message: 'Maaf, terjadi kegagalan pada server kami.',
        });
        
        response.code(500);
        return response;
    }

    async addingSongHandler(request, h) {
        try {
            this._validator.validateSongPayload(request.payload);

            const {
                title,
                year,
                performer,
                genre,
                duration,
            } = request.payload;

            const songId = await this._service.addSong({
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
        catch (error) {
            return this.errorHandler(error, h);
        }
    }

    async gettingAllSongsHandler() {
        const songs = await this._service.getSongs();
        return {
            status: 'success',
            data: {
                songs,
            },
        };
    }

    async gettingSpecifiedSongHandler(request, h) {
        try {
            const { id } = request.params;
            const song = await this._service.getSongById(id);
            return {
                status: 'success',
                data: {
                    song,
                },
            };
        }
        catch (error) {
            return this.errorHandler(error, h);
        }
    }

    async updateSongHandler(request, h) {
        try {
            this._validator.validateSongPayload(request.payload);

            const {
                title,
                year,
                performer,
                genre,
                duration,
            } = request.payload;

            const { id } = request.params;

            await this._service.editSongById(id, {
                title,
                year,
                performer,
                genre,
                duration,
            });

            return {
                status: 'success',
                message: 'Lagu berhasil diperbarui',
            };
        }
        catch (error) {
            return this.errorHandler(error, h);
        }
    }

    async deleteSongHandler(request, h) {
        try {
            const { id } = request.params;

            await this._service.deleteSongById(id);

            return {
                status: 'success',
                message: 'Lagu berhasil dihapus',
            };
        }
        catch (error) {
            return this.errorHandler(error, h);
        }
    }
}

module.exports = SongsHandler;
