const { connection } = require("../database/connection");
const { INTEGER, STRING, DATEONLY, ENUM, DATE } = require("sequelize");

const User = connection.define(
  "user",
  {
    id: {
      type: INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    fullName: {
      type: STRING,
      allowNull: false,
    },
    cpf: {
      type: STRING,
      allowNull: false,
      unique: { msg: "CPF já cadastrado." },
      validate: {
        len: { args: [11, 11], msg: "O campo CPF deve ter 11 dígitos." },
      },
    },
    birthDate: {
      type: DATEONLY,
      allowNull: false,
    },
    email: {
      type: STRING,
      allowNull: false,
      unique: { msg: "Email já cadastrado." },
      validate: {
        isEmail: { msg: "Email inválido." },
      },
    },
    phone: {
      type: STRING,
      allowNull: false,
    },
    password: {
      type: STRING,
      allowNull: false,
      validate: {
        is: {
          args: /(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[a-zA-Z\d@$!%*?&]{8,}/,
          msg: "A senha deve ter no mínimo 8 caracteres, sendo pelo menos 1 letra maiúscula, 1 número e 1 caractere especial.",
        },
      },
    },
    createdBy: {
      type: INTEGER,
      allowNull: true,
      defaultValue: null,
      references: {
        model: { tableName: "users" },
        key: "id",
      },
    },
    typeUser: {
      type: ENUM("Administrador", "Comprador"),
      allowNull: false,
      defaultValue: "Comprador",
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
  { underscored: true, paranoid: true }
);

module.exports = { User };
