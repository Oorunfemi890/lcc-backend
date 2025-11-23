const path = require("path");
const ejs = require("ejs-promise");
const nodemailer = require("nodemailer");

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

    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: process.env.SMTP_PORT == 465, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
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
            console.error(error);
            reject(error);
          }
          return result
            .then(function (data) {
              return resolve(data);
            })
            .catch((error) => {
              console.log("callehere is error: ", error);
              reject(error);
            });
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  send() {
    return new Promise(async (resolve, reject) => {
      try {
        const html = await this.generateHtml();
        const mailOptions = {
          from: this.from,
          to: this.to,
          subject: this.subject,
          html,
        };

        this.transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
            console.log("Email send error: ", error);
            return reject({ message: "failed", error });
          }
          console.log("Email sent: ", info.response);
          resolve({ message: "success", info });
        });
      } catch (error) {
        reject(error);
      }
    });
  }
}

export default MailService;
