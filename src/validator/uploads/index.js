import ImageHeadersSchema from './schema';
import InvariantError from '../../exceptions/InvariantError';

const UploadsValidator = {
  validateImageHeader: (payload) => {
    const validationResult = ImageHeadersSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  }
}

export default UploadsValidator;
