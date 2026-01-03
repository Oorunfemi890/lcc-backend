/**
 * Message Templates for SMS, Email, and WhatsApp
 */

export const MESSAGES = {
    // First Timer Welcome Messages
    FIRST_TIMER: {
        SMS: (surname) =>
            `Welcome to Liberty Christian Centre, ${surname}! We're thrilled you visited us. Join us for services:\n\n• Sunday at 8:00 AM\n• Tuesday at 6:00 PM\n• Thursday at 6:00 PM\n\nWe'd love to see you every Sunday at 8 AM!\n\n- LCC Family`,

        WHATSAPP: (name) =>
            `*Welcome to Liberty Christian Centre!*\n\nDear ${name},\n\nWe're absolutely thrilled that you visited us! Your presence blessed our church family.\n\n*Join Us for Services:*\n📅 Sunday at 8:00 AM\n📅 Tuesday at 6:00 PM\n📅 Thursday at 6:00 PM\n\nWe would be delighted to see you continue worshipping with us every Sunday at 8:00 AM! 🙏\n\nGod bless you!\n\nThe Pastor In Charge \n\n_- Liberty Christian Centre_`,
    },

    // Security PIN Reset Messages
    PIN_RESET: {
        OTP_SMS: (otp) =>
            `Your LCC Security PIN reset OTP is: ${otp}. Valid for 24 hours. Do not share this code with anyone.`,

        OTP_EMAIL_SUBJECT: 'Security PIN Reset - OTP Code',
    },

    // General OTP Messages
    OTP: {
        VERIFICATION: (otp) =>
            `Your LCC verification code is: ${otp}. Valid for 24 hours. Do not share this code with anyone.`,
    },

    // Notification Messages
    NOTIFICATION: {
        SMS: (title, body) =>
            `${title}\n\n${body}\n\n- Liberty Christian Centre`,
    },

    // Follow-Up Messages
    FOLLOW_UP: {
        // Notification to Worker
        WORKER_ASSIGNMENT: (workerName, targetName, type, message) =>
            `Dear ${workerName},\n\nYou have been assigned a ${type} follow-up for ${targetName}.\n\nMessage/Notes: "${message}"\n\nPlease login to the admin portal for more details.\n\n- LCC Admin`,

        // Generic Footer for User Messages
        FOOTER: "\n\n- Liberty Christian Centre"
    }
};

export default MESSAGES;
