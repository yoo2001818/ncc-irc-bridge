'use strict';

const configDir = require('./configDir');
const config = require(configDir + '/auth.js');
const pairConfig = require(configDir + '/pair.js');

let irc, ncc, discord;

const ircConnect = require('./src/connection/irc.js');
const nccConnect = require('./src/connection/ncc.js');
const discordConnect = require('./src/connection/discord.js');

const IRCTransport = require('./src/transport/irc.js');
const NccTransport = require('./src/transport/ncc.js');
const DiscordTransport = require('./src/transport/discord.js');
const Bridge = require('./src/bridge.js');

let bridge = new Bridge();

Promise.all([
  ircConnect(config.irc)
  .then(client => irc = client),
  nccConnect(config.ncc)
  .then(client => ncc = client),
  discordConnect(config.discord)
  .then(client => discord = client)
])
.then(() => {
  console.log('Connected to both server.');
  bridge.connect('irc', new IRCTransport(irc));
  bridge.connect('ncc', new NccTransport(ncc));
  bridge.connect('discord', new DiscordTransport(discord));
  // Good enough, pair the connections.
  for (let fromId in pairConfig) {
    for (let toId of pairConfig[fromId]) {
      bridge.pair(fromId, toId);
    }
  }
})
.catch(e => console.log(e.stack));
