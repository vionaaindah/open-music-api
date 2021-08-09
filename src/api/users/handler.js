/* eslint no-underscore-dangle: ["error", { "allowAfterThis": true }] */

class UsersHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.addingUserHandler = this.addingUserHandler.bind(this);
    this.gettingSpecifiedUserHandler = this.gettingSpecifiedUserHandler.bind(this);
  }

  async addingUserHandler(request, h) {
    this._validator.validateUserPayload(request.payload);
    const { username, password, fullname } = request.payload;

    const userId = await this._service.addUser(
      {
        username,
        password,
        fullname,
      },
    );

    const response = h.response({
      status: 'success',
      message: 'User berhasil ditambahkan',
      data: {
        userId,
      },
    });
    response.code(201);
    return response;
  }

  async gettingSpecifiedUserHandler(request) {
    const { id } = request.params;

    const user = await this._service.getUserById(id);

    return {
      status: 'success',
      data: {
        user,
      },
    };
  }
}

module.exports = UsersHandler;