'use strict';

function mergeRoomId(transport, room) {
  return transport + '!' + room;
}

function getTransportId(roomId) {
  return roomId.slice(0, roomId.indexOf('!'));
}

function getRoomId(roomId) {
  return roomId.slice(roomId.indexOf('!') + 1);
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
    console.log(message);
    if (message.message.startsWith('!pair ')) {
      const target = message.message.slice(6);
      this.pair(roomId, target);
      return;
    }
    if (message.sent === true) return;
    if (pairList == null) return;
    pairList.forEach(to => this.relay(to, message));
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
    let pairList = this.pairs[from] || [];
    pairList.push(to);
    this.pairs[from] = pairList;
    // Notify connection TODO
    this.send(from, `Paired to ${to} as sender.`);
    this.send(to, `Paired to ${from} as listener.`);
  }
  send(to, message) {
    const transportId = getTransportId(to);
    const roomId = getRoomId(to);
    this.transports[transportId].send(roomId, message);
  }
  relay(to, message) {
    const transportId = getTransportId(to);
    const roomId = getRoomId(to);
    this.transports[transportId].relay(roomId, message);
  }
}

module.exports = Bridge;
