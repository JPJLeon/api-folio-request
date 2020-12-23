/* eslint-disable no-undef */

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model');

const STATUS_PENDING = 1;
const STATUS_PROCESSED = 2;
const STATUS_UNDELIVERED = 3;

class Status extends Model {
  static get table() {
    return 'folios.status';
  }

  static get STATUS_PENDING() {
    return STATUS_PENDING;
  }

  static get STATUS_PROCESSED() {
    return STATUS_PROCESSED;
  }

  static get STATUS_UNDELIVERED() {
    return STATUS_UNDELIVERED;
  }
}

module.exports = Status;
