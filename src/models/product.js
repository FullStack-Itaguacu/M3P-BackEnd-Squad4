const { INTEGER, STRING, DATE } = require('sequelize');
const { connection} = require('../database/connection');

const Product = connection.define(
    'product', {
        userId: {
            type: INTEGER,
            references: {
                model: {
                    TableName: 'users'
                },
                key: 'id'
            },
            allowNull: false
        },
        name: {
            type: STRING,
            allowNull: false
        },
        labName: {
            type: STRING,
            allowNull: false
        },
        imageLink: {
            type: STRING,
            allowNull: false
        },
        dosage: {
            type: STRING,
            allowNull: false
        },
        unitPrice: {
            type: INTEGER,
            allowNull: false
        },
        totalStock: {
            type: INTEGER,
            alowNull: false
        },
        typeProduct: {
            type: STRING,
            allowNull: false,
            validate: {
                isIn: {
                    args:[['Medicamento Controlado', 'Medicamento não Controlado']],
                    msg: 'O tipo de produto deve ser Medicamento Controlado ou Medicamento não Controlado'
                }
            }
        },
        description: {
            type: STRING,
            allowNull: true
        },
        createdAt: {
            type: DATE,
            allowNull: false
        },
        updatedAt: {
            type: DATE,
            allowNull: false
        }
    },
    { underscored: true, paranoid: true }
);

module.exports = { Product }