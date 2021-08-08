const routes = (handler) => [
  {
    method: 'POST',
    path: '/songs',
    // addingSongHandler hanya menerima dan menyimpan "satu" lagu.
    handler: handler.addingSongHandler,
  },
  {
    method: 'GET',
    path: '/songs',
    // gettingAllSongsHandler mengembalikan "banyak" lagu.
    handler: handler.gettingAllSongsHandler,
  },
  {
    method: 'GET',
    path: '/songs/{id}',
    // gettingSpecifiedSongHandler mengembalikan "satu" lagu.
    handler: handler.gettingSpecifiedSongHandler,
  },
  {
    method: 'PUT',
    path: '/songs/{id}',
    // updateSongHandler hanya menerima dan mengubah "satu" lagu.
    handler: handler.updateSongHandler,
  },
  {
    method: 'DELETE',
    path: '/songs/{id}',
    // deleteSongHandler hanya menghapus "satu" lagu.
    handler: handler.deleteSonghandler,
  },
];

module.exports = routes;
