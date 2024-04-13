const crypto = require('crypto');

function randomString(byteCount = 20) {
  return crypto.randomBytes(byteCount).toString('hex');
}

module.exports = { randomString };
