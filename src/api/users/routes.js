const routes = (handler) => [
  {
    method: 'POST',
    path: '/users',
    handler: handler.addingUserHandler,
  },
  {
    method: 'GET',
    path: '/users/{id}',
    handler: handler.gettingSpecifiedUserHandler,
  },
];

module.exports = routes;
