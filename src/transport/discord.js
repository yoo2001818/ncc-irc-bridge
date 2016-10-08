'use strict';

const Transport = require('./transport.js');

class IRCTransport extends Transport {
  notifyUser(type, user, to, message, additionalProps) {
    this.notify(Object.assign({
      type: type,
      room: to,
      time: new Date(),
      user: user,
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
        this.notifyUser('image', {
          id: userID,
          nickname: user
        }, channelID, message ? (message + ': ') : '' + attachments[0].url);
        return;
      }
      this.notifyUser('text', {
        id: userID,
        nickname: user
      }, channelID, message);
    });
    this.rooms = {};
  }
  join(room) {
    // this.connection.join(room);
  }
  send(room, message, retries = 0) {
    this.connection.sendMessage({
      to: room,
      message
    }, (error) => {
      if (error && retries < 3) this.send(room, message, retries + 1);
    });
  }
}

module.exports = IRCTransport;