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
    connection.on('message', ({ from, to, message }) => {
      this.notifyUser('text', from, to, message);
    });
    connection.on('notice', ({ from, to, message }) => {
      this.notifyUser('text', from, to, message);
    });
    connection.on('action', ({ from, to, message }) => {
      this.notifyUser('action', from, to, message.slice(8, -1));
    });
    /* connection.on('join', ({ to, from }) => {
      this.notifyUser('join', from, to, from);
    });
    connection.on('part', ({ to, from, reason }) => {
      this.notifyUser('leave', from, to, from, { reason });
    });
    connection.on('quit', ({ from, reason, tos }) => {
      tos.forEach(to => this.notifyUser('leave', from, to, from, { reason }));
    });
    connection.on('kill', ({ from, reason, tos }) => {
      tos.forEach(to => this.notifyUser('leave', from, to, from, { reason }));
    }); */
    this.rooms = {};
  }
  join(room) {
    this.connection.join(room);
  }
  send(room, message) {
    this.connection.send(room, message);
  }
}

module.exports = IRCTransport;
