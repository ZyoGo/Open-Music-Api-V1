import dotenv from 'dotenv';
import Hapi from '@hapi/hapi';
import songs from './api/songs';
import SongsService from './services/postgres/SongsService';
import SongsValidator from './validator/songs';
import ClientError from './exceptions/ClientError';

dotenv.config();

const init = async () => {
  const songsService = new SongsService();

  const server = Hapi.Server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

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

  await server.register({
    plugin: songs,
    options: {
      service: songsService,
      validator: SongsValidator,
    },
  });

  await server.start();

  // eslint-disable-next-line no-console
  console.log(` 🚀 Server berjalan pada ${server.info.uri}`);
};

init();
