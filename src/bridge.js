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
    if (pairList == null) return;
    console.log(pairList);
    pairList.forEach(to => {
      const transportId = getTransportId(to);
      const roomId = getRoomId(to);
      this.transports[transportId].send(roomId, message);
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
    let pairList = this.pairs[from] || [];
    pairList.push(to);
    this.pairs[from] = pairList;
    // Notify connection TODO
  }
}

module.exports = Bridge;
