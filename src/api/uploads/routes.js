import * as path from 'path';

const routes = (handler) => [
  {
    method: 'POST',
    path: '/upload/picture',
    handler: handler.postImageHandler,
    options: {
      payload: {
        allow: 'multipart/form-data',
        multipart: true,
        output: 'stream',
        maxBytes: 500000,
      }
    }
  },
  {
    method: 'GET',
    path: '/upload/{param*}',
    handler: {
      directory: {
        path: path.resolve(__dirname, 'file'),
      },
    },
  },
];

export default routes;
