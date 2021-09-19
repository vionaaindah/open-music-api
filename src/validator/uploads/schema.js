const Joi = require('joi');

const UploadsHeadersSchema = Joi.object({
  'content-type': Joi.string().valid('image/apng', 'image/avif', 'image/gif', 'image/png', 'image/jpeg', 'image/jpg', 'image/webp').required(),
}).unknown();

module.exports = { UploadsHeadersSchema };
