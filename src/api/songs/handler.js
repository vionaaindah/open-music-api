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
            message: 'Maaf atas ketidaknyamanannya, saat ini server kami sedang mengalami kegagalan',
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

        catch (error) {
            return this.errorHandler(error, h);
        }
    }

    async gettingAllSongsHandler() {
        try{
            const songs = await this._service.gettingAllSongs();
            return {
                status: 'success',
                data: {
                    songs,
                },
            };
        }

        catch (error) {
            return this.errorHandler(error, h);
        }
    }

    async gettingSpecifiedSongHandler(request, h) {
        try {
            const { id } = request.params;
            const song = await this._service.gettingSpecifiedSong(id);
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

        catch (error) {
            return this.errorHandler(error, h);
        }
    }

    async deleteSongHandler(request, h) {
        try {
            const { id } = request.params;
            await this._service.deleteSong(id);

            return {
                status: 'success',
                message: 'lagu berhasil dihapus',
            };
        }

        catch (error) {
            return this.errorHandler(error, h);
        }
    }
}

module.exports = SongsHandler;
