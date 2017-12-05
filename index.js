'use strict';

const configDir = require('./configDir');
const config = require(configDir + '/auth.js');
const pairConfig = require(configDir + '/pair.js');

const Bridge = require('./src/bridge.js');

let bridge = new Bridge();

const protocols = {
  irc: {
    connect: require('./src/connection/irc.js'),
    transport: require('./src/transport/irc.js'),
  },
  ncc: {
    connect: require('./src/connection/ncc.js'),
    transport: require('./src/transport/ncc.js'),
  },
  discord: {
    connect: require('./src/connection/discord.js'),
    transport: require('./src/transport/discord.js'),
  },
};

let promises = [];
for (let key in config) {
  if (config[key] == null) continue;
  let protocol = protocols[key];
  if (protocol == null) continue;
  let { connect, transport } = protocol;
  promises.push(connect(config[key])
    .then(v => bridge.connect(key, new transport(v))));
}

Promise.all(promises)
  .then(() => {
    console.log('Connected to all servers.');
    // Good enough, pair the connections.
    for (let fromId in pairConfig) {
      for (let toId of pairConfig[fromId]) {
        bridge.pair(fromId, toId);
      }
    }
  })
  .catch(e => console.log(e.stack));
