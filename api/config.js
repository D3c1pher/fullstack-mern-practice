require('dotenv').config();

const NODE_ENV = process.env.NODE_ENV;

const MONGODB_URI = process.env.MONGODB_URI;
const PORT = process.env.PORT || 4000;

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRATION = process.env.JWT_EXPIRATION;

module.exports = { 
  NODE_ENV, 
  MONGODB_URI, 
  PORT, 
  JWT_SECRET, 
  JWT_EXPIRATION 
};