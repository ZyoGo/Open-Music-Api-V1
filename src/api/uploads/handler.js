class UploadsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.postImageHandler = this.postImageHandler.bind(this);
  }

  async postImageHandler(request, h) {
    const { data } = request.payload;
    this._validator.validateImageHeader(data.hapi.headers);

    const fileName = await this._service.writeFile(data, data.hapi);
    const response = h.response({
      status: 'success',
      data: {
        fileLocation: `http://${process.env.HOST}:${process.env.PORT}/upload/images/${fileName}`,
      },
    });
    response.code(201);
    return response;
  }
}

export default UploadsHandler;
