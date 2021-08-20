import SongsPayloadSchema from './schema';
import InvariantError from '../../exceptions/InvariantError';

const SongsValidator = {
  validateSongsPayload: (payload) => {
    const validationResult = SongsPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

export default SongsValidator;
