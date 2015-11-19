ncc-irc-bridge Protocol Document
================================

This document specifies how the data should be structured in ncc-irc-bridge.

Summary
=======

- Manager: Manages all the current connections, middlewares, etc.
- Connection: Represents a connection with the chat server.
- Middleware: Processes the message and invokes other actions.
- Room: Represents a currently connected room from a connection.
- User: Represents a user from a room.
- Message: Represents a message from a room.

Manager
=======

Manager manages all the current connection, middlewares, rooms, etc.

Connection
==========

Connection represents and maintains a connection with the chat server.

The actual translation between proprietary protocol and ncc-irc-bridge
protocol happens in here.

Connection MUST decode the message to ncc-irc-bridge format before sending it to
the Manager.

Connection MUST encode the message to proprietary format and send it to the
server if it is asked to send a message. However, if the message is an
unsupported type, Connection SHOULD send a fallback text message instead.

Connection has a unique identifier which is used to identify rooms / users
etc. These identifier string should not contain `/` character, because that
character is used to seperate room identifier and connection indentifier.

### Lifecycle

Connection follows these lifecycles.

#### Created

A connection has just created but not connected to the server nor the Manager.

#### Prepared

Connection is connected to the server but not bound to the Manager.

### Connecting

Connection is bound to the Manager but not connected to the server.

### Ready

Connection is bound to the Manager and connected to the server.

In this state, Connection SHOULD notify the Manager if messages are received.

### Disposed

Connection is unbound from the Manager thus disconnected from the server.
