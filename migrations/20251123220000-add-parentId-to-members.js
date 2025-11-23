'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.addColumn('Members', 'parentId', {
            type: Sequelize.UUID,
            allowNull: true,
            references: {
                model: 'Members',
                key: 'id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL'
        });

        // Add index for better query performance
        await queryInterface.addIndex('Members', ['parentId'], {
            name: 'members_parent_id_index'
        });

        // Add gender field
        await queryInterface.addColumn('Members', 'gender', {
            type: Sequelize.ENUM('male', 'female', 'other'),
            allowNull: true
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.removeIndex('Members', 'members_parent_id_index');
        await queryInterface.removeColumn('Members', 'parentId');
        await queryInterface.removeColumn('Members', 'gender');
        // Also remove the ENUM type
        await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_Members_gender";');
    }
};
