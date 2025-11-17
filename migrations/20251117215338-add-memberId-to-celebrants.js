'use strict';

/** @type {import('sequelize-cli').Migration} */
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Celebrants', 'memberId', {
      type: Sequelize.UUID,
      allowNull: true,
      references: {
        model: 'Members',
        key: 'id'
      },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE'
    });

    // Add index for performance
    await queryInterface.addIndex('Celebrants', ['memberId']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Celebrants', 'memberId');
  }
};
