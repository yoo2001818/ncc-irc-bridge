'use strict';

const Discord = require('discord.js');

function connect(config) {
  if (config == null) return Promise.resolve(null);
  const client = new Discord.Client();
  client.on('error', err => {
    console.log(err);
  });
  client.on('disconnect', (msg, code) => {
    if (code === 0) console.error(msg);
    setTimeout(() => {
      client.connected = false;
      client.connect();
    }, 1000);
  });
  return new Promise(resolve => {
    client.login(config.token);
    client.on('ready', () => {
      resolve(client);
    });
  });
}

module.exports = connect;
