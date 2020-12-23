const Drive = use('Drive');
const Env = use('Env');

class Logs {
  static save(body) {
    const date = (new Date()).toISOString();
    const log = `[${date}]: ${body} \n`;
    Drive.append(Env.get('ELASTIC_SEARCH_LOG'), Buffer.from(log))
  }
}

module.exports = Logs;
