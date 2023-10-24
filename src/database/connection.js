const { Sequelize } = require("sequelize");
const databaseConfig = require("../config/database.config");

const connection = databaseConfig.url
  ? new Sequelize(`${databaseConfig.url}?ssl=true`, databaseConfig)
  : new Sequelize(databaseConfig);

module.exports = { connection };
