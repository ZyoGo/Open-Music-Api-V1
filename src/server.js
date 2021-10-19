import dotenv from 'dotenv';
import Hapi from '@hapi/hapi';
import Jwt from '@hapi/jwt';
import Inert from '@hapi/inert';
import path from 'path';
import ClientError from './exceptions/ClientError';

// Plugin Songs
import songs from './api/songs';
import SongsService from './services/postgres/SongsService';
import SongsValidator from './validator/songs';

// Plugin Users
import users from './api/users';
import UsersService from './services/postgres/UsersService';
import UserValidator from './validator/users';

// Plugin Authentications
import authentications from './api/authentications';
import AuthenticationsService from './services/postgres/AuthenticationsService';
import TokenManager from './tokenize/TokenManager';
import AuthenticationsValidator from './validator/authentications';

// Plugin Playlists
import playlists from './api/playlists';
import PlaylistsService from './services/postgres/PlaylistsService';
import PlaylistsValidator from './validator/playlists';

// Plugin Collaborations
import collaboration from './api/collaborations';
import CollaborationsService from './services/postgres/CollaborationsService';
import CollaborationValidator from './validator/collaborations';

// Plugin Uploads
import uploads from './api/uploads';
import StorageService from './services/storage/StorageService';
import UploadsValidator from './validator/uploads';

// PLugin Redis
import CacheService from './services/redis/CacheService';

const __dirname = path.resolve('src');
const fileLoc = 'api/uploads/file/images';
dotenv.config();

const init = async () => {
  const songsService = new SongsService();
  const usersService = new UsersService();
  const cacheService = new CacheService();
  const collaborationsService = new CollaborationsService(cacheService);
  const playlistsService = new PlaylistsService(collaborationsService, cacheService);
  const authenticationsService = new AuthenticationsService();
  const storageService = new StorageService(path.resolve(__dirname, fileLoc));

  const server = Hapi.Server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  // await server.register(Jwt);
  await server.register([
    {
      plugin: Jwt,
    },
    {
      plugin: Inert,
    },
  ]);

  server.auth.strategy('openMusic_JWT', 'jwt', {
    keys: process.env.ACCESS_TOKEN_KEY,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: process.env.ACCESS_TOKEN_AGE,
    },
    validate: (artifacts) => ({
      isValid: true,
      credentials: {
        id: artifacts.decoded.payload.id,
      },
    }),
  });
  // server.auth.strategy();

  server.ext('onPreResponse', (request, h) => {
    const { response } = request;

    if (response instanceof ClientError) {
      const newResponse = h.response({
        status: 'fail',
        message: response.message,
      });

      newResponse.code(response.statusCode);

      return newResponse;
    }

    return response.continue || response;
  });

  await server.register([
    {
      plugin: songs,
      options: {
        service: songsService,
        validator: SongsValidator,
      },
    },
    {
      plugin: users,
      options: {
        service: usersService,
        validator: UserValidator,
      },
    },
    {
      plugin: authentications,
      options: {
        authenticationsService,
        usersService,
        tokenManager: TokenManager,
        validator: AuthenticationsValidator,
      },
    },
    {
      plugin: playlists,
      options: {
        service: playlistsService,
        validator: PlaylistsValidator,
      },
    },
    {
      plugin: collaboration,
      options: {
        collaborationsService,
        playlistsService,
        validator: CollaborationValidator,
      },
    },
    {
      plugin: uploads,
      options: {
        service: storageService,
        validator: UploadsValidator,
      },
    },
  ]);

  await server.start();

  // eslint-disable-next-line no-console
  console.log(` 🚀 Server berjalan pada ${server.info.uri}`);
};

init();
