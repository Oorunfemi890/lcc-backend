import twilio from "twilio";

class SmsService {
    constructor() {
        this.client = twilio(
            process.env.TWILIO_ACCOUNT_SID,
            process.env.TWILIO_AUTH_TOKEN
        );
    }

    send(to, body) {
        return new Promise((resolve, reject) => {
            this.client.messages
                .create({
                    body: body,
                    from: process.env.TWILIO_PHONE_NUMBER,
                    to: to,
                })
                .then((message) => resolve(message))
                .catch((error) => {
                    console.error("SMS send failed:", error);
                    reject(error);
                });
        });
    }
}

export default SmsService;
