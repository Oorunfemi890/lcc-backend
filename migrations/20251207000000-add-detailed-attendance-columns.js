'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.addColumn('Attendances', 'adultsCount', {
            type: Sequelize.INTEGER,
            allowNull: false,
            defaultValue: 0
        });
        await queryInterface.addColumn('Attendances', 'youthCount', {
            type: Sequelize.INTEGER,
            allowNull: false,
            defaultValue: 0
        });
        await queryInterface.addColumn('Attendances', 'visitorsCount', {
            type: Sequelize.INTEGER,
            allowNull: false,
            defaultValue: 0
        });
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.removeColumn('Attendances', 'adultsCount');
        await queryInterface.removeColumn('Attendances', 'youthCount');
        await queryInterface.removeColumn('Attendances', 'visitorsCount');
    }
};
