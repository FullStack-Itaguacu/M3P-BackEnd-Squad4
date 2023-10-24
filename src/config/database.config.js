const { config } = require("dotenv");
config();

const {
  DIALECT,
  HOST,
  USERNAMEPG,
  PASSWORDPG,
  DATABASE,
  PORTPG,
  PORT,
  JWT_SECRET_KEY,
} = process.env;

module.exports = {
  dialect: DIALECT,
  host: HOST,
  username: USERNAMEPG,
  password: PASSWORDPG,
  database: DATABASE,
  port: PORTPG,
  server_port: PORT || 3333,
  jwt_secret_key: JWT_SECRET_KEY,
  define: {
    underscored: true,
    underscoredAll: true,
  },
};
