'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up (queryInterface, Sequelize) {
    await queryInterface.createTable(
      'products', {
        id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
        },
        user_id:{
          type: Sequelize.INTEGER,
          references: {
            model: {
              tableName: 'users'
            },
            key: 'id'
          },
          allowNull: false,
        },
        name: {
          type: Sequelize.STRING,
          allowNull:false,
        },
        lab_name: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        image_link: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        dosage: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        unit_price: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        total_stock: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        type_product: {
          type: Sequelize.ENUM(
            'Medicamento Controlado', 
            'Medicamento Não Controlado'
          ),
          allowNull: false,           
        },
        description: {
          type: Sequelize.STRING,
          allowNull: true,
          defaultValue: null,
        },
        created_at: {
          type: Sequelize.DATE,
          allowNull: false,
        },
        updated_at: {
          type: Sequelize.DATE,
          allowNull: false,
        },
        deleted_at: {
          type: Sequelize.DATE,
          allowNull: true,
        },
      }
    )
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('products');
  }
};