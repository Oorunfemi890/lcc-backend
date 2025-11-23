import WhatsappService from "../service/whatsapp.service";

class WhatsappHelper {
    static async send(to, body) {
        try {
            const whatsappService = new WhatsappService();
            return await whatsappService.send(to, body);
        } catch (error) {
            console.error("WhatsappHelper Error:", error.message);
            return false;
        }
    }
}

export default WhatsappHelper;
