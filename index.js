'use strict';

const config = require('./config/auth.js');

let irc, ncc;

const ircConnect = require('./src/connection/irc.js');
const nccConnect = require('./src/connection/ncc.js');

const IRCTransport = require('./src/transport/irc.js');
const NccTransport = require('./src/transport/ncc.js');
const Bridge = require('./src/bridge.js');

let bridge = new Bridge();

Promise.all([
  ircConnect(config.irc)
  .then(client => irc = client),
  nccConnect(config.ncc)
  .then(client => ncc = client)
])
.then(() => {
  console.log('Connected to both server.');
  bridge.connect('irc', new IRCTransport(irc));
  bridge.connect('ncc', new NccTransport(ncc));
});
