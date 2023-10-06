const { connection } = require('../database/connection');
const { INTEGER, DATE } = require('sequelize');
const { User } = require('./user');
const  Address  = require('./address');

const UserAddress = connection.define("users_addresses", {
  id: {
    type: INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true
  },
  userId: {
    allowNull: false,
    type: INTEGER,
    references: {
      model: User,
      key: 'id'
    },
  },
  addressId: {
    allowNull: false,
    type: INTEGER,
    references: {
      model: Address,
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
  },
},
  { underscored: true, paranoid: true }
);
module.exports = { UserAddress };
