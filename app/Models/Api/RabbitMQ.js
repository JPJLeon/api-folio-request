/* eslint-disable no-await-in-loop */
/* eslint-disable no-undef */

const Env = use('Env');
const amqp = require('amqplib');

class RabbitMQ {
  constructor() {
    this.channel = null;
    this.connection = null;
    this.error = null;
  }

  async connect(host = Env.get('RABBITMQ_HOST')) {
    for (let i = 0; i < 60; i++) {
      try {
        this.connection = await amqp.connect(host)
          .then((connection) => connection)
          .catch((error) => {
            throw error;
          });
        console.log('RABBITMQ CONNECTED');
        break;
      } catch (error) {
        await new Promise((resolve) => setTimeout(resolve, 500));
      }
    }
  }

  async createChannel() {
    this.channel = await this.connection.createChannel()
      .then((channel) => channel)
      .catch((error) => {
        throw error;
      });
  }

  send(queue, message) {
    this.channel.assertQueue(queue, {
      durable: true,
    });
    this.channel.sendToQueue(queue, Buffer.from(message));
  }

  consume(queue, callback, options) {
    this.channel.assertQueue(queue, {
      durable: true,
    });
    this.channel.prefetch(1);
    this.channel.consume(queue, callback, { noAck: false, ...options });
  }

  close() {
    this.connection.close();
  }
}

module.exports = RabbitMQ;
