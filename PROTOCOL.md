ncc-irc-bridge Protocol Document
================================

This document specifies how the data should be structured in ncc-irc-bridge.

Summary
-------

- Bridge: Manages all the current connections, middlewares, etc.
- Connection: Represents a connection with the chat server.
- Middleware: Processes the message and invokes other actions.
- Room: Represents a currently connected room from a connection.
- User: Represents a user from a room.
- Message: Represents a message from a room.

Bridge
------

Bridge manages all the current connection, middlewares, rooms, etc.

Connection
----------

Connection represents and maintains a connection with the chat server.

The actual translation between proprietary protocol and ncc-irc-bridge
protocol happens in here.

Connection MUST decode the message to ncc-irc-bridge format before sending it to
the Bridge.

Connection MUST encode the message to proprietary format and send it to the
server if it is asked to send a message. However, if the message is an
unsupported type, Connection SHOULD send a fallback text message instead.

Connection has a unique identifier which is used to identify rooms / users
etc. These identifier string should not contain `/` character, because that
character is used to seperate room identifier and connection indentifier.

### Lifecycle

Connection follows these lifecycles.

#### Created

A connection has just created but not connected to the server nor the Bridge.

#### Prepared

Connection is connected to the server but not bound to the Bridge.

### Connecting

Connection is bound to the Bridge but not connected to the server.

### Ready

Connection is bound to the Bridge and connected to the server.

In this state, Connection SHOULD notify the Bridge if messages are received.

### Disposed

Connection is unbound from the Bridge thus disconnected from the server.

Message
-------

Represents a single message.

- connection
- room
- user
- type
- message

### connection

The ID of the connection. Such as 'irc', 'test.com', etc.

### room

The room object. Room object should contain these properties.

- id
- name
- topic
- users
- options

#### id

The unique ID of the room.

#### name

The name of the room. If it doesn't exist, unique ID from the server will
be used instead. Such as '#main'.

#### topic

The topic of the room. If it doesn't exist, the name will be used instead.

#### users

An object containing the users and the options participated to the room.

user's ID should be mapped to the user wrapper, for example:

```js
{
  'test': {
    user: {
      id: 'test',
      name: 'Hello'
    },
    voice: true
  },
  'world': {
    user: {
      id: 'world',
      name: 'Test'
    },
    operator: true
  }
}
```

##### user

The user object associated with the object.

##### operator

Whether if the user is the operator of the room. Defaults to false.

#### options

An object containing all the options from the server. IRC channel modes are
used in here.

##### secret

Whether if the room is public or private. Defaults to false.

##### pm

Whether if the room is private 1:1 chat or else. Defaults to false.
