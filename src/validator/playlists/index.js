const InvariantError = require('../../exceptions/InvariantError');
const {
  PlaylistPayloadSchema,
  PlaylistSongPayloadSchema,
} = require('./schema');

const playlistsValidator = {
  validatePlaylistPayloadSchema: (payload) => {
    const validationResult = PlaylistPayloadSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
  validatePlaylistSongPayloadSchema: (payload) => {
    const validationResult = PlaylistSongPayloadSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = playlistsValidator;
