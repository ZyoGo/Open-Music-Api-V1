import Joi from 'joi';

const SongsPayloadSchema = Joi.object({
  title: Joi.string().required(),
  year: Joi.number().required(),
  performer: Joi.string().required(),
  genre: Joi.string(),
  duration: Joi.number(),
});

export default SongsPayloadSchema;