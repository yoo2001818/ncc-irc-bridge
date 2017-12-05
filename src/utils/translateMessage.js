'use strict';

const formatMessage = require('./formatMessage');

function translateMessage(message, config = {}) {
  switch (message.type) {
  case 'image':
    return formatMessage(message, '%n: 사진: %m');
  case 'sticker':
    return formatMessage(message, '%n: 스티커: ' + message.image + ' (%m)');
  case 'join':
    return formatMessage(message, '%n님이 들어왔습니다.');
  case 'leave':
    return formatMessage(message, '%n님이 나갔습니다.');
  case 'reject':
    return formatMessage(message, '%m님이 강제 퇴장당했습니다.');
  case 'invite':
    return formatMessage(message, '%n님이 %m님을 초대했습니다.');
  case 'changeName':
    return formatMessage(message, '방 이름이 %m으로 변경되었습니다.');
  case 'changeMaster':
    return formatMessage(message, '방장이 %m님으로 변경되었습니다.');
  case 'create':
    return formatMessage(message, '방 개설을 환영합니다.');
  case 'action':
    return formatMessage(message, '%n님이 외칩니다: %m');
  case 'text':
  default:
    return formatMessage(message, config.singleMode ? '%m' : '%n: %m');
  }
}

module.exports = translateMessage;
