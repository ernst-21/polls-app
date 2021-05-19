const config = {
  env: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 5000,
  jwtSecret: process.env.JWT_SECRET || "w\\&r*^HjXh8xgZ2ATC$[\"{?hQ>ny?(8&./$Tf2mC$~5\\HJkU*4",
  mongoUri: process.env.MONGODB_URI ||
    process.env.MONGO_HOST ||
    'mongodb://' + (process.env.IP || 'localhost') + ':' +
    (process.env.MONGO_PORT || '27017') +
    '/pollsproject'
}

module.exports = config;
