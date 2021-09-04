"use strict";

var _dotenv = _interopRequireDefault(require("dotenv"));

var _hapi = _interopRequireDefault(require("@hapi/hapi"));

var _songs = _interopRequireDefault(require("./api/songs"));

var _SongsService = _interopRequireDefault(require("./services/postgres/SongsService"));

var _songs2 = _interopRequireDefault(require("./validator/songs"));

var _ClientError = _interopRequireDefault(require("./exceptions/ClientError"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_dotenv.default.config();

const init = async () => {
  const songsService = new _SongsService.default();

  const server = _hapi.default.Server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ['*']
      }
    }
  });

  server.ext('onPreResponse', (request, h) => {
    const {
      response
    } = request;

    if (response instanceof _ClientError.default) {
      const newResponse = h.response({
        status: 'fail',
        message: response.message
      });
      newResponse.code(response.statusCode);
      return newResponse;
    }

    return response.continue || response;
  });
  await server.register({
    plugin: _songs.default,
    options: {
      service: songsService,
      validator: _songs2.default
    }
  });
  await server.start(); // eslint-disable-next-line no-console

  console.log(` 🚀 Server berjalan pada ${server.info.uri}`);
};

init();
//# sourceMappingURL=server.js.map