/* eslint-disable import/no-extraneous-dependencies */
const { LogicalException } = require('@adonisjs/generic-exceptions');

class ScriptException extends LogicalException { }

module.exports = ScriptException;
