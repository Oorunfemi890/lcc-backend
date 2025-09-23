const path = require("path");
const ejs = require("ejs-promise");
import MailGun from "mailgun-js";

class MailService {
  filename;
  params;
  mailgun;
  from;
  to;
  subject;
  constructor(from, to, subject, filename, params) {
    this.filename = filename;
    this.params = params;
    this.mailgun = MailGun({
      apiKey: process.env.MAILGUN_API_KEY,
      domain: process.env.MAILGUN_DOMAIN,
    });
    this.from = from;
    this.to = to;
    this.subject = subject;
  }

  generateHtml() {
    return new Promise(async (resolve, reject) => {
      try {
        const file = path.join(
          __dirname,
          `../../templates/${this.filename}.ejs`
        );
        if (!file) {
          throw new Error(
            `Could not find the ${this.filename} in path ${file}`
          );
        }
        return await ejs.renderFile(file, this.params, {}, (error, result) => {
          if (error) {
            exits.error(error);
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
        var data = {
          from: this.from,
          to: this.to,
          subject: this.subject,
          html,
        };

        this.mailgun.messages().send(data, function (error, body) {
          if (error) {
            console.log("callehhhh ",error);
            return reject({ message: "failed", error });
          }
          console.log("success ooo", body);
          resolve({ message: "success" });
        });
      } catch (error) {
        reject(error);
      }
    });
  }
}

export default MailService;
