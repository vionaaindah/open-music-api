const routes = (handler) => [
  {
    method: 'POST',
    path: '/authentications',
    handler: handler.addingAuthenticationHandler,
  },
  {
    method: 'PUT',
    path: '/authentications',
    handler: handler.updateAuthenticationHandler,
  },
  {
    method: 'DELETE',
    path: '/authentications',
    handler: handler.deleteAuthenticationHandler,
  },
];

module.exports = routes;
