'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        const defaultSettings = [
            {
                key: 'sms',
                value: 'true',
                active: true,
                description: 'Enable/Disable SMS notifications globally',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                key: 'whatsapp',
                value: 'true',
                active: true,
                description: 'Enable/Disable WhatsApp notifications globally',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                key: 'voice_call',
                value: 'true',
                active: true,
                description: 'Enable/Disable Voice Call notifications globally',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                key: 'email',
                value: 'true',
                active: true,
                description: 'Enable/Disable Email notifications globally',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                key: 'smtp_enable',
                value: 'false',
                active: false,
                description: 'Enable/Disable SMTP for email sending (true=SMTP, false=API)',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        ];

        for (const setting of defaultSettings) {
            const [exists] = await queryInterface.sequelize.query(
                `SELECT key FROM "Settings" WHERE key = :key LIMIT 1`,
                {
                    replacements: { key: setting.key },
                    type: Sequelize.QueryTypes.SELECT,
                }
            );

            if (!exists) {
                await queryInterface.bulkInsert('Settings', [setting]);
            }
        }
    },

    async down(queryInterface, Sequelize) {
        // We don't necessarily want to delete settings on rollback as user datamight be lost
        // usually seeders down matches up, but for settings it's risky.
        // I'll leave it empty or delete specific keys? 
        // The migration down dropped the table.
        // I will verify standard practice. Usually seeders delete what they inserted.

        await queryInterface.bulkDelete('Settings', {
            key: ['sms', 'whatsapp', 'voice_call', 'email', 'SMTP_ENABLE']
        });
    }
};
