import MailService from "../service/mail.service";
import db from '../../models';

class MailHelper {
  static async sendMail({
    from = process.env.SMTP_USER,
    to,
    subject,
    template,
    params = {},
  }) {
    try {

      const emailEnabled = await db.Settings.getSetting('email');
      if (emailEnabled === 'false') {
        console.log('Email sending is disabled in settings. Skipping email.');
        return false;
      }

      const mail = new MailService(from, to, subject, template, params);
      mail.send();
      return true;
    } catch (error) {
      console.error("Email send failed:", error.message);
      return false;
    }
  }
}

export default MailHelper;
