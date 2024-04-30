const Redis = require("ioredis");

// ? default: localhost:6379
// ? Bila ingin tembak ke connection remote
// ? Gunakan Object
/** 
  {
    port: 6379, // Redis port
    host: "127.0.0.1", // Redis host
    username: "default", // needs Redis >= 6
    password: "my-top-secret",
    db: 0, // Defaults to 0
  }
 */
const redis = new Redis();

module.exports = redis;
