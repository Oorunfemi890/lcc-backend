'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('Settings', {
            key: {
                type: Sequelize.STRING,
                primaryKey: true,
                allowNull: false,
            },
            value: {
                type: Sequelize.TEXT, // Storing as JSON string or simple text
                allowNull: false,
            },
            description: {
                type: Sequelize.TEXT,
                allowNull: true,
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: Sequelize.fn('NOW'),
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: Sequelize.fn('NOW'),
            },


        });
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('Settings');
    },
};
