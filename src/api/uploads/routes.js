// import path from 'path';

// const __dirname = path.resolve();

const routes = (handler) => [
  {
    method: 'POST',
    path: '/upload/pictures',
    handler: handler.postImageHandler,
    options: {
      payload: {
        allow: 'multipart/form-data',
        multipart: true,
        output: 'stream',
        maxBytes: 500000,
      },
    },
  },
  // {
  //   method: 'GET',
  //   path: '/upload/{param*}',
  //   handler: {
  //     directory: {
  //       path: path.resolve(__dirname, 'file')
  //     }
  //   }
  // },
];

export default routes;
