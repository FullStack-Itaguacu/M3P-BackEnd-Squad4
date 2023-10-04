const { connection } = require("../database/connection");
const { INTEGER, DATEONLY, ENUM, DATE } = require("sequelize")

const Sale = connection.define(
    "sale",
    {
        id: {
            allowNull: false,
            type: INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        /* buyer_id: {
            type: INTEGER,
            allowNull: false,
        }, */
        /* seller_id: {
            type: INTEGER,
            allowNull: false,
        }, */
       /*  product_id: {
            type: INTEGER,
            allowNull: false,
        }, */
        unit_price: {
            type: REAL,
            allowNull: false,
        },
        amount_buy: {
            type: INTEGER,
            allowNull: false,
        },
        /* users_addresses_id: {
            type: INTEGER,
            allowNull: false,
        }, */
        created_at: {
            type: DATE,
            allowNull: false,
        },
        total: {
            type: REAL,
            allowNull: false,
        },
        type_payment: {
            type: ENUM(
                'cartão de crédito',
                'cartão de débito',
                'PIX', 'boleto',
                'transferência bancária'
            ),
            allowNull: false,
        },
    },
    { underscored: true, paranoid: true }
);

Sale.associate = (models) => {
    Sale.hasMany(models.User, { foreignKey: 'buyer_id', as: 'users' });
};

Sale.associate = (models) => {
    Sale.hasMany(models.User, { foreignKey: 'seller_id', as: 'users' });
};

Sale.associate = (models) => {
    Sale.hasMany(models.Product, { foreignKey: 'product_id', as: 'produtcs' });
};

Sale.associate = (models) => {
    Sale.hasMany(models.address, { foreignKey: 'users_addresses_id', as: 'addresses' });
};

module.exports = { Sale };