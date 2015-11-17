'use strict';

const config = require('./config/auth.js');

let irc, ncc;

const ircConnect = require('./src/connection/irc.js');
const nccConnect = require('./src/connection/ncc.js');

Promise.all([
  ircConnect(config.irc)
  .then(client => irc = client),
  nccConnect(config.ncc)
  .then(client => ncc = client)
])
.then(() => {
  console.log('Connected to both server.');
});
