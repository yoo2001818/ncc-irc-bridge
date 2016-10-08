'use strict';

const Discord = require('discord.io');

function connect(config) {
  if (config == null) return Promise.resolve(null);
  const client = new Discord.Client({
    token: config.token,
    autorun: true
  });
  client.on('error', err => {
    console.log(err);
  });
  client.on('disconnect', () => {
    client.connect();
  });
  return new Promise(resolve => {
    client.on('ready', () => {
      resolve(client);
    });
  });
}

module.exports = connect;
