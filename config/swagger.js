'use strict'

module.exports = {
  /*
  |--------------------------------------------------------------------------
  | Swagger Information
  | Please use OpenAPI 3 Specification Docs
  | https://swagger.io/docs/specification/basic-structure/
  |--------------------------------------------------------------------------
  */

  enable: true,
  specUrl: '/swagger.json',

  options: {
    swaggerDefinition: {
      openapi: '3.0.1',
      info: {
        title: 'API Solicitud de Folios',
        description: 'Servicio para solicitar uno o más folios',
        license: {
          name: 'Apache 2.0',
          url: 'http://www.apache.org/licenses/LICENSE-2.0.html',
        },
        version: '0.1.0',
      },
      servers: [
        {
          url: '/',
        },
      ],

      // Example security definitions.
      // securityDefinitions: {
      //   ApiKey: {
      //     description: 'ApiKey description',
      //     name: 'Authorization',
      //   },

      //   // OAuth2 configuration
      //   OAuth2: {
      //     authorizationUrl: 'https://example.com/oauth/authorize',
      //     tokenUrl: 'https://example.com/oauth/token',

      //     // define your scopes here
      //     // remove read, write and admin if not necessary
      //     scopes: {
      //       read: 'Grants read access (this is just sample)',
      //       write: 'Grants write access (this is just sample)',
      //       admin: 'Grants read and write access to administrative information (this is just sample)',
      //     },
      //   },
      // },
      components: {},
    },

    // Path to the API docs
    // Sample usage
    // apis: [
    //    'docs/**/*.yml',    // load recursive all .yml file in docs directory
    //    'docs/**/*.js',     // load recursive all .js file in docs directory
    // ]
    apis: [
      'app/**/*.js',
      'start/routes.js',
      'config/swagger.yml',
    ],
  },
};
