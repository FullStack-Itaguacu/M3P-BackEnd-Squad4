"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("sales", {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      unit_price: {
        type: Sequelize.REAL,
        allowNull: false,
      },
      amount_buy: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      total: {
        type: Sequelize.REAL,
        allowNull: false,
      },
      type_payment: {
        type: Sequelize.ENUM(
          "cartão de crédito",
          "cartão de débito",
          "PIX",
          "boleto",
          "transferência bancária"
        ),
        allowNull: false,
      },
      buyer_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: { tableName: "users" },
          key: "id",
        },
      },
      seller_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: { tableName: "users" },
          key: "id",
        },
      },
      product_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: { tableName: "products" },
          key: "id",
        },
      },
      users_addresses_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: { tableName: "users_addresses" },
          key: "id",
        },
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        allowNull: false,
      },
      deleted_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("sales");
  },
};
