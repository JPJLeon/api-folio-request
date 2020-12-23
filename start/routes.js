/* eslint-disable no-undef */
'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URLs and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route');
const Config = use('Config');

const specUrl = Config.get('swagger.specUrl', '/swagger.json');

Route.group(() => {
  Route.post('/', 'FolioRequestController.index').validator('FolioRequest');
}).prefix('api/folio-request');

Route.get(specUrl, () => {
  const swaggerJSDoc = use('swagger-jsdoc');

  if (Config.get('swagger.enable')) {
    return swaggerJSDoc(Config.get('swagger.options', {}));
  }
});
