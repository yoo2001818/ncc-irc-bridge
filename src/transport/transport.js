'use strict';

class Transport {
  constructor() {
    this.bridge = null;
    this.id = null;
  }
  connectBridge(bridge, id) {
    if (this.bridge != null) {
      throw new Error('This connection is already connected to a bridge');
    }
    this.id = id;
    this.bridge = bridge;
  }
  notify(message) {
    message.transport = this.id;
    this.bridge.handleMessage(message);
  }
  join(room) { // eslint-disable-line no-unused-vars
    throw new Error('Send is not implemented by subclass');
  }
  leave(room) { // eslint-disable-line no-unused-vars
    throw new Error('Send is not implemented by subclass');
  }
  send(room, message) { // eslint-disable-line no-unused-vars
    throw new Error('Send is not implemented by subclass');
  }
}

module.exports = Transport;
