const path = require("path");
const ejs = require("ejs-promise");
const axios = require("axios");
const nodemailer = require("nodemailer");
const { logger } = require("../logger/winston");
const db = require("../../models");

class MailService {
  filename;
  params;
  transporter;
  from;
  to;
  subject;

  constructor(from, to, subject, filename, params) {
    this.filename = filename;
    this.params = params;
    this.from = from;
    this.to = to;
    this.subject = subject;

    // SMTP configuration
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT),
      secure: process.env.SMTP_PORT == 465, // true for 465, false for other ports
      requireTLS: process.env.SMTP_PORT == 587, // true for 587
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 10000,
    });
  }

  generateHtml() {
    return new Promise(async (resolve, reject) => {
      try {
        const file = path.join(
          __dirname,
          `../../templates/${this.filename}.template.ejs`
        );
        if (!file) {
          throw new Error(
            `Could not find the ${this.filename} in path ${file}`
          );
        }
        return await ejs.renderFile(file, this.params, {}, (error, result) => {
          if (error) {
            logger.error(error);
            reject(error);
          }
          return result
            .then(function (data) {
              return resolve(data);
            })
            .catch((error) => {
              logger.info("Error rendering template: ", error);
              reject(error);
            });
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Send email via SMTP
   * @param {string} html - HTML content
   */
  async sendViaSMTP(html) {
    return new Promise((resolve, reject) => {
      const mailOptions = {
        from: this.from,
        to: this.to,
        subject: this.subject,
        html,
      };

      this.transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          logger.error("Email send error: ", error);
          return reject({ message: "failed", error: error.message });
        }
        logger.info("Email sent: ", info.response);
        resolve({ message: "success", info: info.response });
      });
    });
  }

  /**
   * Send email via Generic API (ZeptoMail, Resend, etc.)
   * @param {string} html - HTML content
   */
  async sendViaApi(html) {
    try {
      const url = process.env.PROVIDER_URL;
      const apiKey = process.env.PROVIDER_API_KEY;

      if (!url || !apiKey) {
        throw new Error("Email API configuration missing (EMAIL_PROVIDER_URL or EMAIL_PROVIDER_API_KEY)");
      }

      const payload = {
        from: this.from,
        to: [this.to],
        subject: this.subject,
        html: html
      };

      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      };


      const response = await axios.post(url, payload, { headers });

      logger.info(`Email sent: ${JSON.stringify(response.data)}`);
      return { message: "success", info: response.data };

    } catch (error) {
      const errorMsg = error.response?.data ? JSON.stringify(error.response.data) : error.message;
      logger.error(`Email send error: ${errorMsg}`);
      throw new Error(errorMsg);
    }
  }

  /**
   * Send email with template
   */
  send() {
    return new Promise(async (resolve, reject) => {
      try {
        const html = await this.generateHtml();

        // Check setting to determine method
        const smtpEnable = await db.Settings.isActive('smtp_enable');

        let result;
        if (smtpEnable) {
          result = await this.sendViaSMTP(html);
        } else {
          result = await this.sendViaApi(html);
        }

        resolve(result);
      } catch (error) {
        logger.error("MailService send error:", error);
        resolve(false);
      }
    });
  }

}

export default MailService;
