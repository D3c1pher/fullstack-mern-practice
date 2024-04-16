const jwt = require('jsonwebtoken');
const { createError } = require('./errorHandler');
const { JWT_SECRET, JWT_EXPIRATION } = require('../config');

const handleVerifyError = (err) => {
  switch (err.name) {
    case 'JsonWebTokenError':
      throw createError(401, 'Invalid JWT token');
    case 'TokenExpiredError':
      throw createError(400, 'Token expired');
    default:
      throw createError(500, 'Internal Server Error');
  }
};

const populateUser = (req, decodedToken) => {
  req.user = decodedToken;
};

module.exports.createAccessToken = (user) => {
  const data = {
    id: user.id,
    email: user.email,
    isAdmin: user.isAdmin
  };
  return jwt.sign(data, JWT_SECRET, { expiresIn: JWT_EXPIRATION });
};

module.exports.verifyToken = (req, res, next) => {
  let token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    throw createError(401, 'Unauthorized access');
  }

  jwt.verify(token, JWT_SECRET, (err, decodedToken) => {
    if (err) {
      handleVerifyError(err);
    }
    populateUser(req, decodedToken);
    next();
  });
};

module.exports.verifyAdmin = (req, res, next) => {
	if (!req.user || !req.user.isAdmin) {
		throw createError(403, "Forbidden action");
  }
	next();
};

module.exports.verifyCustomer = (req, res, next) => {
	if (!req.user || req.user.isAdmin) {
		throw createError(403, "Forbidden action");
  }
	next();
};