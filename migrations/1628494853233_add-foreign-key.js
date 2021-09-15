/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  // memberikan constraint foreign key pada owner terhadap kolom id dari tabel users
  pgm.addConstraint('playlists', 'fk_playlists.owner', 'FOREIGN KEY(owner) REFERENCES users(id) ON DELETE CASCADE');

  // memberikan constraint foreign key pada playlist_id terhadap kolom id dari tabel playlists
  pgm.addConstraint('playlistsongs', 'fk_playlistsongs.playlist_id', 'FOREIGN KEY(playlist_id) REFERENCES playlists(id) ON DELETE CASCADE');

  // memberikan constraint foreign key pada song_id terhadap kolom id dari tabel songs
  pgm.addConstraint('playlistsongs', 'fk_playlistsongs.song_id', 'FOREIGN KEY(song_id) REFERENCES songs(id) ON DELETE CASCADE');
};

exports.down = (pgm) => {
  // menghapus constraint fk_playlists.owner pada tabel playlist
  pgm.dropConstraint('playlists', 'fk_playlists.owner');

  // menghapus constraint fk_playlistsongs.playlist_id pada tabel playlistsongs
  pgm.dropConstraint('playlistsongs', 'fk_playlistsongs.playlist_id');

  // menghapus constraint fk_playlistsongs.song_id pada tabel playlistsongs
  pgm.dropConstraint('playlistsongs', 'fk_playlistsongs.song_id');
};
