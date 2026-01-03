import axios from "axios";
import { logger } from "../logger/winston";
import db from '../../models';

class WhatsappService {
    constructor() {
        // Termii configuration
        this.whatsappApiKey = process.env.TERMII_API_KEY
        this.whatsappSenderId = process.env.TERMII_SENDER_ID
        this.smsApiUrl = process.env.TERMII_MESSAGE_API_URL
    }

    /**
     * Send WhatsApp message to a single recipient
     * @param {string} to - Recipient phone number (e.g., +2348012345678 or 08012345678)
     * @param {string} message - WhatsApp message
     * @param {boolean} bypassSettings - If true, ignores global WhatsApp disabled setting
     */
    async send(to, message) {
        try {

            const whatsappEnabled = await db.Settings.isActive('whatsapp');
            if (!whatsappEnabled) {
                logger.info('WhatsApp sending is disabled in settings. Skipping WhatsApp message.');
                return;
            }


            if (!this.whatsappApiKey) {
                logger.warn('Termii API key not configured. Skipping WhatsApp send.');
                return;
            }

            // Normalize phone number
            const phoneNumber = this.normalizePhoneNumber(to);

            await this.sendViaTermii(phoneNumber, message);

            logger.info(`WhatsApp message sent to ${phoneNumber.substring(0, 8)}...`);
        } catch (error) {
            logger.error(`Failed to send WhatsApp message: ${error.message}`);
            // Return false instead of throwing to prevent unhandled rejections in async calls
            return false;
        }
    }

    /**
     * Send WhatsApp message via Termii
     * @param {string} to - Recipient phone number
     * @param {string} message - Message text
     */
    async sendViaTermii(to, message) {
        try {

            const payload = {
                api_key: this.whatsappApiKey,
                to,
                type: 'plain',
                channel: 'whatsapp',
                from: this.whatsappSenderId,
                sms: message,
            };

            const response = await axios.post(this.smsApiUrl, payload, {
                headers: {
                    'Content-Type': 'application/json',
                },
                timeout: 10000,
                validateStatus: function (status) {
                    return status >= 200 && status < 600;
                }
            });

            logger.info(`Termii API Response: ${JSON.stringify(response.data)}`);

            if (response.data.code !== 'ok') {
                const errorMessage = response.data.message || response.data.error || JSON.stringify(response.data);
                throw new Error(`Termii API error: ${errorMessage}`);
            }

        } catch (error) {
            logger.error(`Termii WhatsApp error: ${error.message}`);
            throw error;
        }
    }

    /**
     * Normalize phone number to international format
     * @param {string} phoneNumber - Phone number
     * @returns {string} Normalized phone number
     */
    normalizePhoneNumber(phoneNumber) {
        // Remove all non-digit characters
        let normalized = phoneNumber.replace(/\D/g, '');

        // If starts with 0, replace with country code (234 for Nigeria)
        if (normalized.startsWith('0')) {
            const countryCode = process.env.WHATSAPP_COUNTRY_CODE || '234';
            normalized = countryCode + normalized.substring(1);
        }

        // Remove + prefix if present for API calls
        normalized = normalized.replace('+', '');

        return normalized;
    }

    /**
     * Send notification via WhatsApp
     * @param {string} to - Recipient phone number
     * @param {string} title - Notification title
     * @param {string} body - Notification body
     */
    async sendNotificationMessage(to, title, body) {
        const message = `*${title}*\n\n${body}\n\n_- Liberty Christian Centre_`;
        await this.send(to, message);
    }

    /**
     * Send bulk WhatsApp messages
     * @param {string[]} recipients - Array of phone numbers
     * @param {string} message - Message text
     */
    async sendBulkMessages(recipients, message) {
        try {
            // Check global setting for bulk
            const whatsappEnabled = await db.Settings.isActive('whatsapp');
            if (!whatsappEnabled) {
                logger.info('WhatsApp sending is disabled in settings. Skipping bulk WhatsApp.');
                return;
            }

            if (!this.whatsappApiKey) {
                logger.warn('Termii API key not configured. Skipping bulk send.');
                return;
            }

            const promises = recipients.map((recipient) =>
                this.send(recipient, message, true).catch((error) => {
                    logger.error(`Failed to send WhatsApp to ${recipient}: ${error.message}`);
                })
            );

            await Promise.allSettled(promises);
            logger.info(`Bulk WhatsApp sent to ${recipients.length} recipients`);
        } catch (error) {
            logger.error(`Failed to send bulk WhatsApp: ${error.message}`);
            throw error;
        }
    }
}

export default WhatsappService;
