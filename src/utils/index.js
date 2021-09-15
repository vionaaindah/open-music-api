/* eslint-disable camelcase */

const mapDBToModel = ({
  insertedat,
  updatedat,
  playlist_id,
  song_id,
  ...args
}) => ({
  ...args,
  insertedAt: insertedat,
  updatedAt: updatedat,
  playlistId: playlist_id,
  songId: song_id,
});

module.exports = { mapDBToModel };
