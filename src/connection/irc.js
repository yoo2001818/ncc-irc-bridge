'use strict';

const irc = require('slate-irc');
const net = require('net');

function connect(config) {
  if (config == null) return Promise.resolve(null);
  const stream = net.connect({
    port: config.port,
    host: config.server
  });
  const client = irc(stream);
  client.nick(config.nick);
  client.pass(config.password);
  client.user(config.userName, client.realName);
  client.on('error', err => {
    console.log(err);
  });
  return new Promise(resolve => {
    client.on('motd', () => {
      resolve(client);
    });
  });
}

module.exports = connect;
