const jwt = require('jsonwebtoken');

const { env } = require('../config/env');

function unauthorized(message) {
  return {
    code: 401,
    message,
    data: null,
  };
}

function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization || '';

  if (!authHeader.startsWith('Bearer ')) {
    return res.status(401).json(unauthorized('missing_bearer_token'));
  }

  if (!env.jwtSecret) {
    return res.status(401).json(unauthorized('jwt_not_configured'));
  }

  const token = authHeader.slice(7).trim();

  if (!token) {
    return res.status(401).json(unauthorized('missing_bearer_token'));
  }

  try {
    req.auth = jwt.verify(token, env.jwtSecret);
    return next();
  } catch (error) {
    return res.status(401).json(unauthorized('invalid_or_expired_token'));
  }
}

function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.auth) {
      return res.status(401).json(unauthorized('missing_auth_context'));
    }

    if (!roles.includes(req.auth.role)) {
      return res.status(403).json({
        code: 403,
        message: 'forbidden',
        data: {
          requiredRoles: roles,
        },
      });
    }

    return next();
  };
}

module.exports = {
  requireAuth,
  requireRole,
};
