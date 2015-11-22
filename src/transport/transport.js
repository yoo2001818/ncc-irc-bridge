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
    message.connection = this.id;
    this.bridge.handleMessage(message);
  }
  send() {
    throw new Error('Send is not implemented by subclass');
  }
}

module.exports = Transport;
