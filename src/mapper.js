class Mapper {
  constructor() {
    this.connections = {};
    this.mappings = {};
  }
  addConnection(name, conn) {
    this.connections[name] = conn;
    conn.init(this, name);
  }
  handleMessage(message) {
    const roomId = message.conn + '/' + message.room;
    const mapping = this.mappings[roomId];
    if (mapping == null) return;
    // Find all mapping and relay messages to them
    mapping.forEach(target => {
      const [targetConnId, targetRoomId] = target.split('/');
      const targetConn = this.connections[targetConnId];
      targetConn.handle(targetRoomId, message);
    })
  }
}

module.exports = Mapper;
