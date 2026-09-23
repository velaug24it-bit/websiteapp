const jwt = require('jsonwebtoken');

const generateToken = (payload, expiresIn = '30d') => {
  const secret = process.env.JWT_SECRET || 'kadalai_mittai_jwt_secret_groundnut_store';
  return jwt.sign(payload, secret, { expiresIn });
};

module.exports = generateToken;
