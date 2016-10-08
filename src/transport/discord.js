'use strict';

const Transport = require('./transport.js');

class IRCTransport extends Transport {
  notifyUser(type, from, to, message, additionalProps) {
    this.notify(Object.assign({
      type: type,
      room: to,
      time: new Date(),
      user: {
        id: from,
        nickname: from
      },
      message: message,
      sent: false
    }, additionalProps || {}));
  }
  constructor(connection) {
    super();
    if (connection == null) return;
    this.connection = connection;
    connection.on('message', (user, userID, channelID, message, event) => {
      if (userID === connection.id) return;
      let attachments = event.d.attachments;
      if (attachments.length >= 1) {
        this.notifyUser('image', user, channelID, message + ': ' +
          attachments[0].url);
        return;
      }
      this.notifyUser('text', user, channelID, message);
    });
    this.rooms = {};
  }
  join(room) {
    // this.connection.join(room);
  }
  send(room, message) {
    this.connection.sendMessage({
      to: room,
      message
    });
  }
}

module.exports = IRCTransport;
