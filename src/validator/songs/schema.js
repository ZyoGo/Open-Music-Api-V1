import Joi from 'joi';

const SongsPayloadSchema = Joi.object({
  title: Joi.string().required(),
  // eslint-disable-next-line newline-per-chained-call
  year: Joi.number().integer().min(1900).max(2021).required(),
  performer: Joi.string().required(),
  genre: Joi.string(),
  duration: Joi.number(),
});

export default SongsPayloadSchema;
