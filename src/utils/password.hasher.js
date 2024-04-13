const bcrypt = require('bcrypt');

// Just know that it hashes a password
async function hashPassword(plainPassword, saltRounds = 10) {
  return new Promise((resolve, reject) => {
    bcrypt.hash(plainPassword, saltRounds, function (err, hash) {
      if (err) {
        reject(err);
      } else {
        resolve(hash);
      }
    });
  });
}

module.exports = hashPassword;
