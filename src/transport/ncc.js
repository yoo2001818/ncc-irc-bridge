'use strict';

const Transport = require('./transport.js');
const uploadImage = require('node-ncc-es6/lib/uploadImage.js').default;
const formatMessage = require('../utils/formatMessage');
const request = require('request');

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
    if (connection == null) return;
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
  relay(room, message) {
    if (message.type === 'image') {
      let filename = message.filename;
      if (filename == null) {
        // Not sure how to improve this regex
        let splited = /^.+\/([^/?]+).+$/.exec(message.image)[1];
        filename = splited || new Date().getTime()+'.jpg';
      }
      let mimeSplit = filename.split('.');
      mimeSplit = mimeSplit[mimeSplit.length - 1];
      let mime = 'image/' + mimeSplit.toLowerCase();
      uploadImage(this.connection.request, request.get(message.image), {
        filename, contentType: mime
      }).then(image => {
        console.log(image);
        let comment = '%n: 사진을 보냈습니다:';
        if (message.comment) {
          comment = '%n: 사진을 보냈습니다: ' + message.comment;
        }
        let text = formatMessage(message, comment);
        this.send(room, text).then(() => {
          setTimeout(() => {
            this.connection.sendImage({
              id: getRoomId(room),
              cafe: {
                id: getCafeId(room)
              }
            }, image);
          }, 100);
        });
      }, error => {
        // Just do it traditionally
        console.log(error);
        super.relay(room, message);
      });
      return;
    }
    super.relay(room, message);
  }
}

module.exports = NccTransport;
