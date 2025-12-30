'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.addColumn('Members', 'resetOtp', {
            type: Sequelize.STRING,
            allowNull: true,
        });

        await queryInterface.addColumn('Members', 'resetOtpExpiry', {
            type: Sequelize.DATE,
            allowNull: true,
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.removeColumn('Members', 'resetOtp');
        await queryInterface.removeColumn('Members', 'resetOtpExpiry');
    }
};
