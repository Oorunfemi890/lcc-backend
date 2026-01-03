import SmsService from "../service/sms.service";
import { logger } from "../logger/winston";

class SmsHelper {
    static async send(to, body) {
        try {
            const smsService = new SmsService();
            return await smsService.send(to, body);
        } catch (error) {
            logger.error(`SmsHelper Error: ${error.message}`);
            return false;
        }
    }
}

export default SmsHelper;
