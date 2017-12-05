'use strict';

const LOG_DISPLAY_FORMAT = '[%t] %r - %n : %m';
const formatMessage = require('./utils/formatMessage');

function mergeRoomId(transport, room) {
  return transport + '!' + room;
}

function getTransportId(roomId) {
  return roomId.slice(0, roomId.indexOf('!'));
}

function getRoomId(roomId) {
  if (roomId.indexOf('$') !== -1) {
    return roomId.slice(roomId.indexOf('!') + 1, roomId.indexOf('$'));
  } else {
    return roomId.slice(roomId.indexOf('!') + 1);
  }
}

function stripRoomId(roomId) {
  if (roomId.indexOf('$') !== -1) {
    return roomId.slice(0, roomId.indexOf('$'));
  } else {
    return roomId.slice(0);
  }
}

function getConfig(roomId) {
  let pos = roomId.indexOf('$');
  if (pos === -1) return {};
  let str = roomId.slice(0, pos);
  let output = {};
  str.split('').forEach(v => {
    if (v === 's') output.singleMode = true;
  });
  return output;
}

class Bridge {
  constructor() {
    this.transports = {};
    this.pairs = {};
  }
  connect(id, transport) {
    if (this.transports[id]) throw new Error('Already registered identifier');
    this.transports[id] = transport;
    transport.connectBridge(this, id);
  }
  disconnect(id) { //eslint-disable-line no-unused-vars
    throw new Error('Not implemented yet');
  }
  handleMessage(message) {
    const roomId = mergeRoomId(message.transport, message.room);
    const pairList = this.pairs[roomId];
    /*if (message.message.startsWith('!pair ')) {
      const target = message.message.slice(6);
      this.pair(roomId, target);
      return;
    }*/
    if (message.sent === true) return;
    console.log(formatMessage(message, LOG_DISPLAY_FORMAT));
    if (pairList == null) return;
    pairList.forEach(entry => {
      entry.list.forEach(to => {
        this.relay(to, message, entry.config);
      });
    });
  }
  join(id) {
    const transportId = getTransportId(id);
    const roomId = getRoomId(id);
    this.transports[transportId].join(roomId);
  }
  pair(from, to) {
    // Join both room! :P
    this.join(from);
    this.join(to);
    let fromId = stripRoomId(from);
    let config = getConfig(from);
    let pairList = this.pairs[fromId];
    if (pairList == null) this.pairs[fromId] = pairList = [];
    let entry = pairList.find(v => v.id === from);
    if (entry == null) {
      entry = { id: from, config, list: [] };
      pairList.push(entry);
    }
    entry.list.push(to);
    // Notify connection TODO
    // this.send(from, `Paired to ${to} as sender.`);
    // this.send(to, `Paired to ${from} as listener.`);
  }
  send(to, message) {
    const transportId = getTransportId(to);
    const roomId = getRoomId(to);
    this.transports[transportId].send(roomId, message);
  }
  relay(to, message, config) {
    const transportId = getTransportId(to);
    const roomId = getRoomId(to);
    this.transports[transportId].relay(roomId, message, config);
  }
}

module.exports = Bridge;
