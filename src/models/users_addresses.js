const { connection } = require('../database/connection');
const { INTEGER, DATE } = require('sequelize');
const { users } = require('./user');
const { addresses } = require('./address');

const users_addresses = connection.define("users_addresses", {
  id: {
    type: INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true
  },
  user_id: {
    allowNull: false,
    type: INTEGER,
    references: {
      model: users,
      key: 'id'
    },
  },
  address_id: {
    allowNull: false,
    type: INTEGER,
    references: {
      model: addresses,
      key: 'id'
    },
  },
  created_at: {
    type: DATE,
    allowNull: false
  },
  updated_at: {
    type: DATE,
    allowNull: false
  }
});
module.exports = { users_addresses };
