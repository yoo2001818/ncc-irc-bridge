'use strict';

const ncc = require('node-ncc-es6');
const fs = require('fs');

function connect(config) {
  const credentials = new ncc.Credentials(
    config.username,
    config.password
  );
  const session = new ncc.Session(credentials);

  return new Promise((resolve, reject) => {
    fs.readFile('./config/cookie.json', 'utf8', (err, data) => {
      if (err) return reject(err);
      return resolve(data);
    });
  })
  .then(JSON.parse, () => null)
  .then(cookieJar => credentials.setCookieJar(cookieJar))
  .then(() => console.log('Validating Naver login information'))
  .then(() => credentials.validateLogin())
  .then(username => {
    console.log('Logged into Naver with username', username);
  }, () => {
    console.log('Logging into Naver');
    return credentials.login()
      .then(() => fs.writeFile('./config/cookie.json',
        JSON.stringify(credentials.getCookieJar())));
  })
  .then(() => console.log('Connecting to Naver cafe chat...'))
  .then(() => session.connect())
  .then(() => console.log('Fetching room list...'))
  .then(() => session.getRoomList())
  .then(() => {
    console.log('Connected to Naver cafe chat.');
    return session;
  })
  .catch(err => {
    console.log(err.stack);
    process.exit(1);
  });
}

module.exports = connect;
