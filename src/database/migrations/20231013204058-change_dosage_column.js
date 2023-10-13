'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.changeColumn('products', 'dosage', {
      type: Sequelize.ENUM('mg', 'mcg', 'g', 'mL', '%', 'Outro' ),
      allowNull: false
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.changeColumn('products', 'dosage',{
      type: SequelizeScopeError.string,
      allowNull: false
    })
  }
};
