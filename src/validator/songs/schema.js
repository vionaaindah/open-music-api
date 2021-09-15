const Joi = require('joi');

const date = new Date();
const CurrentYear = date.getFullYear();

const SongPayloadSchema = Joi.object({
  title: Joi.string().required(),
  year: Joi.number().integer().min(1900).max(CurrentYear)
    .required(),
  performer: Joi.string().required(),
  genre: Joi.string(),
  duration: Joi.number().integer(),
});

module.exports = { SongPayloadSchema };
