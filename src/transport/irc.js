'use strict';

const Transport = require('./transport.js');

class IRCTransport extends Transport {
  constructor(connection) {
    super();
    this.connection = connection;
    connection.on('message', (from, to, message) => {
      this.notify({
        type: 'text',
        room: to,
        time: new Date(),
        user: {
          id: from,
          nickname: from
        },
        message: message,
        sent: false
      });
    });
    this.rooms = {};
  }
  join(room) {
    this.connection.join(room);
  }
  send(room, message) {
    this.connection.say(room, message);
  }
}

module.exports = IRCTransport;
