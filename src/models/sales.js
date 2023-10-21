const { connection } = require("../database/connection");
const { INTEGER, REAL, ENUM, DATE } = require("sequelize");
const { Product } = require('../models/product')

const Sale = connection.define(
  "sale",
  {
    id: {
      type: INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    unitPrice: {
      type: REAL,
      allowNull: false,
    },
    amountBuy: {
      type: INTEGER,
      allowNull: false,
    },
    total: {
      type: REAL,
      allowNull: false,
    },
    typePayment: {
      type: ENUM(
        "cartão de crédito",
        "cartão de débito",
        "PIX",
        "boleto",
        "transferência bancária"
      ),
      allowNull: false,
    },
    buyerId: {
      type: INTEGER,
      allowNull: false,
      references: {
        model: { tableName: "users" },
        key: "id",
      },
    },
    sellerId: {
      type: INTEGER,
      allowNull: false,
      references: {
        model: { tableName: "users" },
        key: "id",
      },
    },
    productId: {
      type: INTEGER,
      allowNull: false,
      references: {
        model: { tableName: "products" },
        key: "id",
      },
    },
    usersAddressesId: {
      type: INTEGER,
      allowNull: false,
      references: {
        model: { tableName: "users_addresses" },
        key: "id",
      },
    },
    createdAt: {
      type: DATE,
      allowNull: false,
    },
    updatedAt: {
      type: DATE,
      allowNull: false,
    },
  },
  { underscored: true, paranoid: true, timestamps: true }
);
Sale.belongsTo(Product)

module.exports = { Sale };