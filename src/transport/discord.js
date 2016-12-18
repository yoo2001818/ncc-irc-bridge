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
      let channel = connection.channels[channelID];
      let server = connection.servers[channel.guild_id];
      let member = server.members[userID];
      let nick = member.nick || user;
      let attachments = event.d.attachments;
      // console.log(attachments);
      if (attachments.length >= 1) {
        this.notifyUser('image', {
          id: userID,
          nickname: nick
        }, channelID, (message ? (message + ': ') : '') + attachments[0].url, {
          image: attachments[0].url,
          filename: attachments[0].filename,
          comment: message
        });
        return;
      }
      this.notifyUser('text', {
        id: userID,
        nickname: nick
      }, channelID, message);
    });
    connection.on('disconnect', () => {
      connection.connect();
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
