/* eslint-disable no-undef */

const FolioRequest = use('App/Models/FolioRequest');
const RabbitMQ = use('App/Models/Api/RabbitMQ');
const Status = use('App/Models/Status');
const { Command } = require('@adonisjs/ace');

const DEFAULT_QUEUE = 'Processed';

class ListenQueue extends Command {
  static get signature() {
    return 'listen:queue';
  }

  static get description() {
    return 'Tell something helpful about this command';
  }

  async handle() {
    const queue = DEFAULT_QUEUE;
    const rabbitMQ = new RabbitMQ();

    await rabbitMQ.connect();
    await rabbitMQ.createChannel();

    this.info(` [*] Waiting for messages in ${queue}. To exit press CTRL+C`);
    rabbitMQ.consume(queue, async (message) => {
      const text = message.content.toString();
      const secs = text.split('.').length - 1;

      this.info(` [x] Received ${text}`);
      await this.updateDatabase(JSON.parse(text));

      setTimeout((/* done */) => {
        this.info(' [x] Done');
        rabbitMQ.channel.ack(message);
      }, secs * 1000);
    });
  }

  async updateDatabase({ folios, folioRequestId: id }) {
    const request = await FolioRequest.query()
      .where('id', id)
      .where('status_id', Status.STATUS_PENDING)
      .first();

    if (request === null) {
      this.info(` [x] ${id} not found in database`);
      return;
    }

    request.merge({
      folios: JSON.stringify(folios),
      status_id: Status.STATUS_PROCESSED,
    });
    await request.save();
  }
}

module.exports = ListenQueue;
