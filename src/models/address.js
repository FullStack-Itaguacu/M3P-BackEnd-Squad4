const { DataTypes } = require("sequelize");
const { connection } = require("../database/connection");

const Address = connection.define(
  "address",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    zip: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    street: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    numberStreet: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    neighborhood: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    state: {
      type: DataTypes.STRING(2),
      allowNull: false,
    },
    complement: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },
    lat: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },
    long: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
  {
    underscored: true,
    paranoid: true,
  }
);

module.exports = Address;
