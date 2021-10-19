class ExportHandler {
  constructor(service, playlistsService, validator) {
    this._service = service;
    this._playlistService = playlistsService;
    this._validator = validator;

    this.postExportSongsHandler = this.postExportSongsHandler.bind(this);
  }

  async postExportSongsHandler(request, h) {
    await this._validator.validateExportSongspayload(request.payload);
    const { playlistId } = request.params;
    const { id: userId } = request.auth.credentials;

    await this._playlistService.verifyPlaylistAccess(playlistId, userId);

    const message = {
      userId,
      playlistId,
      targetEmail: request.payload.targetEmail,
    };

    await this._service.sendMessage('export:songs', JSON.stringify(message));

    const response = h.response({
      status: 'success',
      message: 'Permintaan anda dalam antrean',
    });
    response.code(201);
    return response;
  }
}

export default ExportHandler;
