import CollaborationHandler from './handler';
import routes from './routes';

export default {
  name: 'collaboration',
  version: '1.0.0',
  register: async (server, { collaborationsService, playlistsService, validator }) => {
    // eslint-disable-next-line max-len
    const collaborationHandler = new CollaborationHandler(collaborationsService, playlistsService, validator);
    server.route(routes(collaborationHandler));
  },
};
