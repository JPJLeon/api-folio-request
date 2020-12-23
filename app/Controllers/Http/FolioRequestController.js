/* eslint-disable no-await-in-loop */
/* eslint-disable no-undef */

// import winston plugin
const logger = require("../../../plugins/winston");

const Env = use('Env');
const EntityQueue = use('App/Models/EntityQueue');
const FolioRequest = use('App/Models/FolioRequest');
const ScriptException = use('App/Exceptions/ScriptException');
const Status = use('App/Models/Status');
const RabbitMQ = use('App/Models/Api/RabbitMQ');

class FolioRequestController {
  /**
   * Devuelve una Poliza en especifico por id
   *
   * @param {Object} params
   * @param {Object} request
   * @param {Object} response
   */
  async index({ request, response }) {
    try {
      // inicio para calcular time exec
      const startTime = Date.now();
      const data = request.all();
      const body = {
        entityId: parseInt(data.entityId, 10),
        quantity: parseInt(data.numberFolioRequest, 10),
      };

      const activeQueue = await EntityQueue.getActiveQueue(body.entityId);
      if (activeQueue === null) {
        throw new ScriptException('La entidad no es valida');
      }

      const time = Env.get('RABBITMQ_TIME');
      const queueName = activeQueue.queue;

      const folio = await FolioRequest.create({
        status_id: Status.STATUS_PENDING,
        body: JSON.stringify(body),
      });

      const rabbitMQ = new RabbitMQ();
      await rabbitMQ.connect();
      await rabbitMQ.createChannel();

      rabbitMQ.send(queueName, JSON.stringify({ ...body, folioRequestId: folio.id }));

      for (let i = 0, j = 6; i < j; i += 1) {
        await this.sleep(time);
        await folio.reload();
        if (folio.status_id === Status.STATUS_PROCESSED) {
          break;
        }
      }

      rabbitMQ.close();

      if (folio.status_id === Status.STATUS_PENDING) {
        folio.merge({
          status_id: Status.STATUS_UNDELIVERED,
        });
        await folio.save();

        return response.status(408)
          .json({
            code: 408,
            messages: 'Error al recuperar los folios',
          });
      }

      // fin para calcular time exec
      const endTime = Date.now();
      const totalTime = endTime - startTime;
      const bodyElastic = {
        api: 'folioRequest@index',
        entityId: parseInt(data.entityId, 10),
        quantity: parseInt(data.numberFolioRequest, 10),
        code: 201,
        time: totalTime,
      };
      logger.info("Solicitud de Folio", bodyElastic);

      return response.status(201)
        .json({
          code: 201,
          data: {
            folios: JSON.parse(folio.folios),
          },
        });
    } catch (error) {
      if (error instanceof ScriptException) {
        return response.status(400)
          .json({
            code: 400,
            messages: error.message,
          });
      }
      return response.status(400)
        .json({
          code: 400,
          messages: 'Error al procesar la solicitud',
        });
    }
  }

  sleep(milliseconds) {
    return new Promise((resolve) => {
      setTimeout(resolve, milliseconds);
    });
  }
}

module.exports = FolioRequestController;
