'use strict';

function pad(i) {
  return ('00' + i).slice(-2);
}

function formatMessage(message, format) {
  var time = message.time;
  var timeFormatted = [time.getHours(), time.getMinutes(), time.getSeconds()]
    .map(pad).join(':');
  var dateFormatted = time.getFullYear()+'/'+pad(time.getMonth()+1)+'/'+
    pad(time.getDate());
  var formattedMessage = format;
  formattedMessage = formattedMessage.replace('%d', () => dateFormatted);
  formattedMessage = formattedMessage.replace('%t', () => timeFormatted);
  formattedMessage = formattedMessage.replace('%r',
    () => message.roomObj ? message.roomObj.name : message.room);
  formattedMessage = formattedMessage.replace('%R', () => message.room);
  formattedMessage = formattedMessage.replace('%n', () =>
    message.user.nickname);
  formattedMessage = formattedMessage.replace('%i', () => message.user.id);
  // We might want to translate this to text representation.
  formattedMessage = formattedMessage.replace('%m', () => message.message);
  return formattedMessage;
}

module.exports = formatMessage;
