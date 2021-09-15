const routes = (handler) => [
  {
    method: 'POST',
    path: '/users',
    handler: handler.addingUserHandler,
  },
];

module.exports = routes;
