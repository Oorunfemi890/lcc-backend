import WhatsappService from "../service/whatsapp.service";
import { logger } from "../logger/winston";

class WhatsappHelper {
    static async send(to, body) {
        try {
            const whatsappService = new WhatsappService();
            return await whatsappService.send(to, body);
        } catch (error) {
            logger.error(`WhatsappHelper Error: ${error.message}`);
            return false;
        }
    }
}

export default WhatsappHelper;
