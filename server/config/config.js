const mongoPSW = require('./mongoKey')

const config = {
  env: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 5000,
  jwtSecret: process.env.JWT_SECRET || "w\\&r*^HjXh8xgZ2ATC$[\"{?hQ>ny?(8&./$Tf2mC$~5\\HJkU*4",
  mongoUri: process.env.MONGODB_URI || `mongodb://ernst:${mongoPSW}@cluster0-shard-00-00.eofmn.mongodb.net:27017,cluster0-shard-00-01.eofmn.mongodb.net:27017,cluster0-shard-00-02.eofmn.mongodb.net:27017/polls-app?ssl=true&replicaSet=atlas-10p98v-shard-0&authSource=admin&retryWrites=true&w=majority` ||
    process.env.MONGO_HOST ||
    'mongodb://' + (process.env.IP || 'localhost') + ':' +
    (process.env.MONGO_PORT || '27017') +
    '/pollsproject'
}

module.exports = config;
