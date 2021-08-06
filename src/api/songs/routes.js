const routes = (handler) => [
    {
        method: 'POST',
        path: '/songs',
        handler: handler.addingSongHandler, // addingSongHandler hanya menerima dan menyimpan "satu" lagu.
    },
    {
        method: 'GET',
        path: '/songs',
        handler: handler.gettingAllSongsHandler, // gettingAllSongsHandler mengembalikan "banyak" lagu.
    },
    {
        method: 'GET',
        path: '/songs/{id}',
        handler: handler.gettingSpecifiedSongHandler, // gettingSpecifiedSongHandler mengembalikan "satu" lagu.
    },
    {
        method: 'PUT',
        path: '/songs/{id}',
        handler: handler.updateSongHandler, // updateSongHandler hanya menerima dan mengubah "satu" lagu.
    },
    {
        method: 'DELETE',
        path: '/songs/{id}',
        handler: handler.deleteSonghandler, // deleteSongHandler hanya menghapus "satu" lagu.
    },
];
  
module.exports = routes;