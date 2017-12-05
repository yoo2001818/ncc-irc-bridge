'use strict';

const Transport = require('./transport.js');

class DiscordTransport extends Transport {
  notifyUser(type, user, to, message, additionalProps) {
    this.notify(Object.assign({
      type: type,
      room: to,
      time: new Date(),
      user: user,
      message: message,
      sent: false,
    }, additionalProps || {}));
  }
  constructor(connection, config) {
    super();
    if (connection == null) return;
    this.lastID = null;
    this.config = config;
    this.connection = connection;
    connection.on('message', (message) => {
      if (this.lastID === message.id) return;
      if (message.author.id === connection.user.id) return;
      this.lastID = message.id;
      let channel = message.channel;
      let user = message.author;
      let nick = (message.member && message.member.displayName)
        || user.username;
      let attachments = message.attachments.array();
      // console.log(attachments);
      if (attachments.length >= 1) {
        this.notifyUser('image', {
          id: user.id,
          nickname: nick
        }, channel.id, (message ? (message + ': ') : '') + attachments[0].url, {
          image: attachments[0].url,
          filename: attachments[0].filename,
          comment: message.content
        });
        return;
      }
      this.notifyUser('text', {
        id: user.id,
        nickname: nick
      }, channel.id, message.content);
    });
    connection.on('disconnect', () => {
      connection.connect();
    });
    this.rooms = {};
  }
  join() {
    // this.connection.join(room);
  }
  send(room, message, retries = 0) {
    let channel = this.connection.channels.get(room);
    if (channel == null) return;
    return channel.send(message)
      .catch(e => {
        if (retries < 3) return this.send(room, message, retries + 1);
        throw e;
      });
    /*
    this.connection.sendMessage({
      to: room,
      message
    }, (error) => {
      if (error && retries < 3) this.send(room, message, retries + 1);
    });
    */
  }
}

module.exports = DiscordTransport;
