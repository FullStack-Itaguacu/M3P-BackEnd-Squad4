const { config } = require("dotenv");
config();

const {
  DATABASE_URL,
  USERNAMEDB,
  PASSWORDDB,
  DATABASE,
  HOST,
  DIALECT,
  PORTDB,
} = process.env;

module.exports = {
  url: DATABASE_URL,
  username: USERNAMEDB,
  password: PASSWORDDB,
  database: DATABASE,
  host: HOST,
  dialect: DIALECT,
  port: PORTDB,
  define: {
    underscored: true,
    underscoredAll: true,
  },
};
