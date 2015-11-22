'use strict';

const irc = require('irc');

function connect(config) {
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
