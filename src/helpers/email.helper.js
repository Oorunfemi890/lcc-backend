import MailService from "../service/mail.service";

class MailHelper {
  static async sendMail({
    from = "info@libertychristiancentre.com",
    to,
    subject,
    template,
    params = {},
  }) {
    try {
      const mail = new MailService(from, to, subject, template, params);
      return await mail.send();
    } catch (error) {
      console.error("Email send failed:", error.message);
      return false;
    }
  }
}

export default MailHelper;
