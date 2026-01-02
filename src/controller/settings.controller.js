import db from "../../models";
const { Settings } = db;
import { logger } from '../logger/winston';

class SettingsController {
    // ✅ Get all settings
    static async getSettings(req, res) {
        try {
            const settings = await Settings.findAll();

            // Convert array to object key-value pairs for easier frontend consumption
            const settingsMap = {};
            settings.forEach(setting => {
                settingsMap[setting.key] = {
                    value: setting.value,
                    active: setting.active,
                    description: setting.description
                };
            });

            return res.status(200).send({
                success: true,
                message: "Settings fetched successfully",
                data: settingsMap
            });
        } catch (error) {
            logger.error('Get Settings Error:', error);
            return res.status(500).send({
                success: false,
                message: "Internal server error"
            });
        }
    }

    // ✅ Create new setting
    static async createSetting(req, res) {
        try {
            const { key, value, description, active } = req.body;

            if (!key || value === undefined) {
                return res.status(400).send({
                    success: false,
                    message: "Key and value are required"
                });
            }

            // Check if already exists
            const existing = await Settings.findByPk(key);
            if (existing) {
                return res.status(409).send({
                    success: false,
                    message: "Setting with this key already exists. Use PATCH to update."
                });
            }

            const setting = await Settings.create({
                key,
                value: String(value),
                active: active !== undefined ? active : true,
                description: description || `Custom setting: ${key}`
            });

            return res.status(201).send({
                success: true,
                message: "Setting created successfully",
                data: setting
            });
        } catch (error) {
            logger.error('Create Setting Error:', error);
            return res.status(500).send({
                success: false,
                message: "Internal server error"
            });
        }
    }

    // ✅ Patch/Update existing setting
    static async patchSetting(req, res) {
        try {
            const { key } = req.params;
            const { value, active } = req.body;

            if (value === undefined && active === undefined) {
                return res.status(400).send({
                    success: false,
                    message: "Value or Active status is required"
                });
            }

            const setting = await Settings.findByPk(key);
            if (!setting) {
                return res.status(404).send({
                    success: false,
                    message: "Setting not found"
                });
            }

            const updates = {};
            if (value !== undefined) updates.value = String(value);
            if (active !== undefined) updates.active = active;

            await setting.update(updates);

            return res.status(200).send({
                success: true,
                message: "Setting updated successfully",
                data: setting
            });
        } catch (error) {
            logger.error('Patch Setting Error:', error);
            return res.status(500).send({
                success: false,
                message: "Internal server error"
            });
        }
    }
}

export default SettingsController;
