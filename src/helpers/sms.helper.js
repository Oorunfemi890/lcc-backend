import SmsService from "../service/sms.service";

class SmsHelper {
    static async send(to, body) {
        try {
            const smsService = new SmsService();
            return await smsService.send(to, body);
        } catch (error) {
            console.error("SmsHelper Error:", error.message);
            return false;
        }
    }
}

export default SmsHelper;
