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

        // Seed default settings
        const defaultSettings = [
            {
                key: 'sms',
                value: 'true',
                description: 'Enable/Disable SMS notifications globally',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                key: 'whatsapp',
                value: 'true',
                description: 'Enable/Disable WhatsApp notifications globally',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                key: 'voice_call',
                value: 'true',
                description: 'Enable/Disable Voice Call notifications globally',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                key: 'email',
                value: 'true',
                description: 'Enable/Disable Email notifications globally',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        ];

        await queryInterface.bulkInsert('Settings', defaultSettings);
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('Settings');
    },
};
