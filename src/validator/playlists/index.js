import { PostPlaylistPayloadSchema, PostSongPlaylistPayloadSchema } from './schema';
import InvariantError from '../../exceptions/InvariantError';

const PlaylistsValidator = {
  validatePostPlaylistPayload: (payload) => {
    const validationResult = PostPlaylistPayloadSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },

  validatePostSongPlaylistPayload: (payload) => {
    const validationResult = PostSongPlaylistPayloadSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

export default PlaylistsValidator;
