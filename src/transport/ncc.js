'use strict';

const Transport = require('./transport.js');

function mergeRoomId(cafe, room) {
  return cafe + '!' + room;
}

function getCafeId(roomId) {
  return roomId.slice(0, roomId.indexOf('!'));
}

function getRoomId(roomId) {
  return roomId.slice(roomId.indexOf('!') + 1);
}

class NccTransport extends Transport {
  constructor(connection) {
    super();
    this.connection = connection;
    connection.on('message', message => {
      this.notify(Object.assign({}, message, {
        // Flatten room object to string
        room: mergeRoomId(message.room.cafe.id, message.room.id),
        roomObj: message.room
      }));
    });
    this.rooms = {};
  }
  join(room) {
    let cafeId = getCafeId(room);
    let roomId = getRoomId(room);
    return this.connection.joinRoom(cafeId, roomId)
    .then(roomObj => {
      this.rooms[room] = roomObj;
    });
  }
  send(room, message) {
    /*return this.connection.sendMsg(Object.assign({}, message, {
      room: this.rooms[room]
    }));*/
    return this.connection.sendText({
      id: getRoomId(room),
      cafe: {
        id: getCafeId(room)
      }
    }, message);
  }
}

module.exports = NccTransport;
