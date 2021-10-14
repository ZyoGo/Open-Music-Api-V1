import CollaborationPayloadSchema from './schema';
import InvariantError from '../../exceptions/InvariantError';

const CollaborationValidator = {
  validateCollaborationPayload: (payload) => {
    const collaborationvalidationResult = CollaborationPayloadSchema.validate(payload);

    if (collaborationvalidationResult.error) {
      throw new InvariantError(collaborationvalidationResult.error.message);
    }
  },
};

export default CollaborationValidator;
