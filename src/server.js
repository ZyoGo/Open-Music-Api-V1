// eslint-disable-next-line import/no-unresolved
// require('dontenv').config();
import dotenv from 'dotenv';
import Hapi from '@hapi/hapi';

dotenv.config();

const init = async () => {
  const server = Hapi.Server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  await server.start();

  // eslint-disable-next-line no-console
  console.log(` 🚀 Server berjalan pada ${server.info.uri}`);
};

init();
