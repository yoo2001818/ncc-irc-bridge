'use strict';

const irc = require('irc');

function connect(config) {
  if (config == null) return Promise.resolve(null);
  const client = new irc.Client(config.server, config.nick, config);
  client.on('error', err => {
    console.log(err);
  });
  return new Promise(resolve => {
    client.on('registered', () => {
      resolve(client);
    });
  });
}

module.exports = connect;
