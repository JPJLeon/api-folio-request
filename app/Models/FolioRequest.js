/* eslint-disable no-undef */

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model');

class FolioRequest extends Model {
  static get table() {
    return 'folios.folio_requests';
  }
}

module.exports = FolioRequest;
