/* eslint-disable no-undef */

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model');

class EntityQueue extends Model {
  static get table() {
    return 'folios.entity_queues';
  }

  static getActiveQueue(id) {
    return EntityQueue.query()
      .where('entity_id', id).where('is_active', true).first();
  }
}

module.exports = EntityQueue;
