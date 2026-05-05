// Placeholder for shared configuration
module.exports = {
  jwtSecret: process.env.JWT_SECRET || 'changeme',
  mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/omnia',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
};
