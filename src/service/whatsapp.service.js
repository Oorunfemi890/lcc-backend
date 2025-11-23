import twilio from "twilio";

class WhatsappService {
    constructor() {
        this.client = twilio(
            process.env.TWILIO_ACCOUNT_SID,
            process.env.TWILIO_AUTH_TOKEN
        );
    }

    send(to, body) {
        return new Promise((resolve, reject) => {
            // Ensure 'to' number is in the correct format for WhatsApp (e.g., +1234567890)
            // Twilio expects 'whatsapp:+1234567890'
            const formattedTo = to.startsWith("whatsapp:") ? to : `whatsapp:${to}`;
            const formattedFrom = process.env.TWILIO_WHATSAPP_NUMBER.startsWith("whatsapp:")
                ? process.env.TWILIO_WHATSAPP_NUMBER
                : `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`;

            this.client.messages
                .create({
                    body: body,
                    from: formattedFrom,
                    to: formattedTo,
                })
                .then((message) => resolve(message))
                .catch((error) => {
                    console.error("WhatsApp send failed:", error);
                    reject(error);
                });
        });
    }
}

export default WhatsappService;
