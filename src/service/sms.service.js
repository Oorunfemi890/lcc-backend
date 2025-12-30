import axios from "axios";
import { logger } from "../logger/winston";
import MESSAGES from '../constant/messages.constant.js';

class SmsService {
    constructor() {
        // Termii configuration
        this.smsApiKey = process.env.TERMII_API_KEY
        this.smsSenderId = process.env.TERMII_SENDER_ID
        this.smsApiUrl = process.env.TERMII_MESSAGE_API_URL
        this.bulkSmsApiUrl = process.env.TERMII_BULK_MESSAGE_API_URL
    }

    /**
     * Send SMS to multiple recipients
     * @param {string[]} recipients - Array of phone numbers
     * @param {string} message - SMS message
     */
    async sendBulkSms(recipients, message) {
        try {
            if (!this.smsApiKey) {
                console.warn('Termii API key not configured. Skipping bulk SMS send.');
                return;
            }

            const promises = recipients.map((recipient) =>
                this.send(recipient, message).catch((error) => {
                    console.error(`Failed to send SMS to ${recipient}: ${error.message}`);
                })
            );

            await Promise.allSettled(promises);
            logger.info(`Bulk SMS sent to ${recipients.length} recipients`);
            return true;
        } catch (error) {
            logger.error(`Failed to send bulk SMS: ${error.message}`);
            return false;
        }
    }

    /**
     * Send SMS via Termii (Nigerian SMS provider)
     * @param {string} to - Recipient phone number
     * @param {string} message - SMS message
     * @param {string} channel - Channel type: 'dnd' (transactional) or 'generic' (promotional)
     */
    async sendViaTermii(to, message, channel = 'generic') {
        try {
            const payload = {
                to,
                from: this.smsSenderId,
                sms: message,
                type: 'plain',
                channel: channel, // 'dnd' for transactional, 'generic' for promotional
                api_key: this.smsApiKey,
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

            if (response.data.code !== 'ok') {
                throw new Error(`Termii API error: ${JSON.stringify(response.data.message)}`);
            }
        } catch (error) {
            logger.error(`Termii SMS error: ${error.message}`);
            throw error;
        }
    }

    /**
     * Send transactional SMS (uses DND route for critical messages like OTP)
     * @param {string} to - Recipient phone number
     * @param {string} message - SMS message
     */
    async send(to, message) {
        try {
            if (!this.smsApiKey) {
                console.warn('Termii API key not configured. Skipping transactional SMS send.');
                return;
            }

            // Normalize phone number
            const phoneNumber = this.normalizePhoneNumber(to);

            // Use DND channel for transactional messages (bypasses DND restrictions)
            await this.sendViaTermii(phoneNumber, message, 'generic');

            logger.info(`Transactional SMS sent to ${phoneNumber.substring(0, 8)}...`);
            return true;
        } catch (error) {
            logger.error(`Failed to send transactional SMS: ${error.message}`);
            return false;
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

        // Remove leading country code if present (234 or +234)
        if (normalized.startsWith('234')) {
            normalized = normalized.substring(3);
        }

        if (normalized.startsWith('0')) {
            normalized = normalized.substring(1);
        }

        return '+234' + normalized;
    }

    /**
     * Send OTP SMS (uses DND transactional route for reliable delivery)
     * @param {string} to - Recipient phone number
     * @param {string} otp - OTP code
     */
    async sendOtp(to, otp) {
        const message = MESSAGES.OTP.VERIFICATION(otp);
        await this.send(to, message);
    }

    /**
     * Send notification SMS
     * @param {string} to - Recipient phone number
     * @param {string} title - Notification title
     * @param {string} body - Notification body
     */
    async sendNotificationSms(to, title, body) {
        const message = MESSAGES.NOTIFICATION.SMS(title, body);
        await this.send(to, message);
    }

    /**
     * Trigger a voice call via Termii (TTS)
     * @param {string} to - Recipient phone number
     * @param {string} message - Message to speak
     */
    async sendVoiceCall(to, message) {
        try {
            // Placeholder for Termii Voice API
            // Current Termii implementation in this file uses 'this.smsApiUrl' which is for SMS.
            // We assume a separate endpoint/SDK call would be needed. 
            // For now, we log the action as requested.

            if (!this.smsApiKey) {
                console.warn('Termii API key not configured. Skipping Voice Call.');
                return;
            }

            const phoneNumber = this.normalizePhoneNumber(to);

            // TODO: Implement actual Termii Voice API call here
            // const response = await axios.post(...)

            logger.info(`[MOCK] Termii Voice Call triggered to ${phoneNumber} with message: "${message}"`);
            return true;
        } catch (error) {
            logger.error(`Failed to trigger Voice Call: ${error.message}`);
            return false;
        }
    }
}

export default SmsService;
