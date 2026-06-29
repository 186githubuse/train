const bcrypt = require('bcryptjs');

const SALT_ROUNDS = 10;

async function hashPassword(password) {
  return bcrypt.hash(password, SALT_ROUNDS);
}

async function verifyPassword(password, hash) {
  return bcrypt.compare(password, hash);
}

module.exports = {
  SALT_ROUNDS,
  hashPassword,
  verifyPassword,
};
