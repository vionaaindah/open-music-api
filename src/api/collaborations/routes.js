const routes = (handler) => [
  {
    method: 'POST',
    path: '/collaborations',
    handler: handler.addingCollaborationHandler,
    options: {
      auth: 'songsapp_jwt',
    },
  },
  {
    method: 'DELETE',
    path: '/collaborations',
    handler: handler.deleteCollaborationHandler,
    options: {
      auth: 'songsapp_jwt',
    },
  },
];

module.exports = routes;
