const { config } = require("dotenv");
config();

const { DIALECT, HOST, USERNAMEDB, PASSWORDDB, DATABASE, PORT, JWT_SECRET_KEY } = process.env;

module.exports = {
  dialect: DIALECT,
  host: HOST,
  username: USERNAMEDB,
  password: PASSWORDDB,
  database: DATABASE,
  port: PORT,
  jwt_secret_key: JWT_SECRET_KEY,
  define: {
    underscored: true,
    underscoredAll: true,
  },
};
