const InvariantError = require('../../exceptions/InvariantError');
const { UploadsHeadersSchema } = require('./schema');

const UploadsValidator = {
  validateUploadsHeadersSchema: (header) => {
    const validationResult = UploadsHeadersSchema.validate(header);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = UploadsValidator;
