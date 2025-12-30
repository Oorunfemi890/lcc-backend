'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Settings extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }

        /**
         * Get a specific setting value by key
         * @param {string} key 
         * @returns {Promise<string|null>} value
         */
        static async getSetting(key) {
            const setting = await this.findByPk(key);
            return setting ? setting.value : null;
        }

        /**
         * Get all settings as a key-value object
         * optimized for single DB call
         * @returns {Promise<Object>} Object with keys as setting keys and values as setting values
         */
        static async getAllSettingsAsObject() {
            const settings = await this.findAll();
            const settingsMap = {};
            settings.forEach(setting => {
                settingsMap[setting.key] = setting.value;
            });
            return settingsMap;
        }

        /**
         * Set a specific setting value
         * @param {string} key 
         * @param {string} value 
         * @returns {Promise<Settings>}
         */
        static async setSetting(key, value) {
            const [setting] = await this.upsert({
                key,
                value: String(value)
            });
            return setting;
        }
    }

    Settings.init({
        key: {
            type: DataTypes.STRING,
            primaryKey: true,
            allowNull: false
        },
        value: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        description: DataTypes.TEXT
    }, {
        sequelize,
        modelName: 'Settings',
    });
    return Settings;
};
