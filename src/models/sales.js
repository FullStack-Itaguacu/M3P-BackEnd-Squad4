const { connection } = require("../database/connection");
const { INTEGER, REAL, ENUM, DATE } = require("sequelize");

const Sale = connection.define(
  "sale",
  {
    id: {
      type: INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    unit_price: {
      type: REAL,
      allowNull: false,
    },
    amount_buy: {
      type: INTEGER,
      allowNull: false,
    },
    total: {
      type: REAL,
      allowNull: false,
    },
    type_payment: {
      type: ENUM(
        "cartão de crédito",
        "cartão de débito",
        "PIX",
        "boleto",
        "transferência bancária"
      ),
      allowNull: false,
    },
    buyer_id: {
      type: INTEGER,
      allowNull: false,
      references: {
        model: { tableName: "users" },
        key: "id",
      },
    },
    seller_id: {
      type: INTEGER,
      allowNull: false,
      references: {
        model: { tableName: "users" },
        key: "id",
      },
    },
    product_id: {
      type: INTEGER,
      allowNull: false,
      references: {
        model: { tableName: "products" },
        key: "id",
      },
    },
    users_addresses_id: {
      type: INTEGER,
      allowNull: false,
      references: {
        model: { tableName: "users_addresses" },
        key: "id",
      },
    },
    created_at: {
      type: DATE,
      allowNull: false,
    },
    update_at: {
      type: DATE,
      allowNull: false,
    },
  },
  { underscored: true, paranoid: true }
);

// Sale.associate = (models) => {
//   Sale.hasMany(models.User, { foreignKey: "buyer_id", as: "users" });
// };

// Sale.associate = (models) => {
//   Sale.hasMany(models.User, { foreignKey: "seller_id", as: "users" });
// };

// Sale.associate = (models) => {
//   Sale.hasMany(models.Product, { foreignKey: "product_id", as: "produtcs" });
// };

// Sale.associate = (models) => {
//   Sale.hasMany(models.address, {
//     foreignKey: "users_addresses_id",
//     as: "addresses",
//   });
// };

module.exports = { Sale };
