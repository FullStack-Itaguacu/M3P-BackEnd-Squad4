const { config } = require("dotenv");
config();

const { PORT, JWT_SECRET_KEY } = process.env;

module.exports = {
  port: PORT || 3333,
  jwt_secret_key: JWT_SECRET_KEY,
};
