class FolioRequest {
  get rules() {
    return {
      // entityId: 'required|number|above:0',
      entityId: 'required|number',
      numberFolioRequest: 'required|number|range:0,1001',
    };
  }

  get messages() {
    return {
      above: 'El campo {{field}} esta por debajo de lo permitido',
      dateFormat: 'El campo {{field}} debe tener el siguiente formato YYYY-MM-DD',
      in: 'El campo {{field}} debe tener un valor permitido {{argument}}',
      number: 'El campo {{field}} debe ser de tipo numérico',
      range: 'El campo {{field}} esta fuera del rango permitido (1-1000)',
      required: 'El campo {{field}} es requerido',
    };
  }

  async fails(errorMessages) {
    return this.ctx.response.status(400)
      .json({
        code: 400,
        messages: errorMessages,
      });
  }
}

module.exports = FolioRequest;
