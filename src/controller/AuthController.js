import db from "../../models";
import App from "../helpers";
import MailService from "../service/MailService";
import { Op } from "sequelize";

const User = db.User;
const AdminUser = db.AdminUser;

class AuthController {
  static async signUp(req, res) {
    try {
      const {
        firstName,
        lastName,
        password,
        phoneNumber,
        address,
        email,
        countryCode,
      } = req.body;

      if (!email || !phoneNumber || !countryCode)
        return res.status(409).send({
          message: "Missing Email{email}|Phonenumber{phoneNumber}|countryCode",
        });

      let newPhoneNumber = "";
      if (phoneNumber[0] === "0") {
        newPhoneNumber = phoneNumber.substring(1, phoneNumber.length);
      } else {
        newPhoneNumber = phoneNumber;
      }

      const userExits = await User.findOne({
        where: {
          [Op.or]: [{ phoneNumber: newPhoneNumber, countryCode }, { email }],
        },
        raw: true,
      });
      if (userExits)
        return res.status(409).send({ message: "Email/Phonenumber exists" });

      const hashPassword = App.hashPassword(password);

      console.log("countryCode: ", countryCode);

      const user = await User.create(
        {
          email,
          firstName,
          lastName,
          password: hashPassword,
          phoneNumber: newPhoneNumber,
          address,
          countryCode,
        },
        { raw: true }
      );

      const mail = new MailService(
        "support@splishpay.com",
        email,
        "Welcome onBoard",
        "welcome",
        {}
      );

      await mail.send();

      const token = App.assignToken({ id: user.id, email: user.email });

      res.status(201).send({ message: "Successful", user: { ...user, token } });
    } catch (error) {
      throw new Error(error);
    }
  }
  static async createAdmin(req, res) {
    try {
      const {
        firstName,
        lastName,
        password,
        phoneNumber,
        address,
        email,
        countryCode,
      } = req.body;

      if (!email || !phoneNumber || !countryCode)
        return res.status(409).send({
          message: "Missing Email{email}|Phonenumber{phoneNumber}|countryCode",
        });

      let newPhoneNumber = "".substring;

      if (phoneNumber[0] === "0") {
        newPhoneNumber = phoneNumber.substring(1, phoneNumber.length - 1);
      } else {
        newPhoneNumber = phoneNumber;
      }

      const userExits = await AdminUser.findOne({
        where: {
          [Op.or]: [{ phoneNumber: newPhoneNumber, countryCode }, { email }],
        },
      });
      if (userExits)
        return res.status(409).send({ message: "Email/Phonenumber exists" });

      const hashPassword = App.hashPassword(password);

      const user = await AdminUser.create(
        {
          email,
          firstName,
          lastName,
          password: hashPassword,
          phoneNumber: newPhoneNumber,
          address,
          countryCode,
          role: "ADMIN",
        },
        { raw: true }
      );

      const mail = new MailService(
        "support@splishpay.com",
        email,
        "Welcome onBoard",
        "welcome",
        {}
      );

      await mail.send();

      const token = App.assignToken({ id: user.id, email: user.email });

      res.status(201).send({ message: "Successful", user: { ...user, token } });
    } catch (error) {
      console.log("error: ", error);
      throw new Error(error);
    }
  }
  static async login(req, res) {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({
        where: { email },
        raw: true,
      });
      if (!user)
        return res
          .status(404)
          .send({ message: "Wrong email/password combination" });

      if (!App.isPasswordEqual(password, user.password))
        return res
          .status(404)
          .send({ message: "Wrong email/password combination" });

      const token = App.assignToken({ id: user.id, email: user.email });

      return res.status(200).send({ user: { ...user, token } });
    } catch (error) {
      throw new Error(error);
    }
  }

  static async adminLogin(req, res) {
    try {
      const { email, password } = req.body;
      const user = await AdminUser.findOne({
        where: { email },
        raw: true,
      });
      if (!user)
        return res
          .status(404)
          .send({ message: "Wrong email/password combination" });

      if (!App.isPasswordEqual(password, user.password))
        return res
          .status(404)
          .send({ message: "Wrong email/password combination" });

      const token = App.assignToken({
        id: user.id,
        email: user.email,
        role: user.role,
      });

      return res.status(200).send({ user: { ...user, token } });
    } catch (error) {
      throw new Error(error);
    }
  }

  static async forgotPassword(req, res) {
    try {
      const { email } = req.body;
      const user = await User.findOne({ where: { email } });
      if (!user)
        return res
          .status(404)
          .send({ message: "Wrong email/User does not exist" });

      const token = App.assignToken({ id: user.id, email: user.email }, "30m");

      const mail = new MailService(
        "support@splishpay.com",
        user.email,
        "Password Recovery",
        "resetpassword",
        {
          token,
          CLIENT_URL: process.env.CLIENT_URL,
        }
      );
      await mail.send();

      return res
        .status(200)
        .send({ message: "check your email for password reset" });
    } catch (error) {
      throw new Error(error);
    }
  }

  static async resetPassword(req, res) {
    try {
      const { newPassword } = req.body;

      const userExits = await User.findOne({ where: { id: req.user.id } });
      if (!userExits)
        return res.status(409).send({ message: "User not found" });

      if (!newPassword || newPassword.trim() === "")
        return res.status(406).send({ message: "newPassword is required" });

      const password = App.hashPassword(newPassword);

      await User.update({ password }, { where: { id: req.user.id } });

      res.status(200).send({ message: "Password updated successfully" });
    } catch (error) {
      throw new Error(error);
    }
  }

  static async changePassword(req, res) {
    try {
      const { oldPassword, newPassword } = req.body;
      const user = await User.findOne({
        where: { id: req.user.id },
        raw: true,
      });

      if (!App.isPasswordEqual(oldPassword, user.password))
        return res.status(404).send({ message: "invalid old password" });

      const password = App.hashPassword(newPassword);
      await User.update({ password }, { where: { id: req.user.id } });
      res.status(200).send({ message: "Password updated successfully" });
    } catch (error) {
      throw new Error(error);
    }
  }

  static async editProfile(req, res) {
    try {
      const { phoneNumber, ...rest } = req.body;

      let newPhoneNumber =
        phoneNumber[0] === "0"
          ? phoneNumber.substring(1, phoneNumber.length)
          : phoneNumber;
      await User.update(
        { phoneNumber: newPhoneNumber, ...rest },
        { where: { id: req.user.id } }
      );

      res.status(200).send({ message: "profile updated successfully" });
    } catch (error) {
      throw new Error(error);
    }
  }

  static async verifyPhoneNumber(req, res) {
    try {
      const { phoneNumber, countryCode } = req.body;
      if (!phoneNumber || !countryCode)
        return res
          .status(409)
          .send({ message: "Missing Phonenumber{phoneNumber}|countryCode" });

      const userExits = await User.findOne({
        where: { phoneNumber, countryCode },
      });
      if (userExits) return res.status(200).send({ data: true });

      return res.status(200).send({ data: false });
    } catch (error) {
      throw new Error(error);
    }
  }

  static async verifyEmail(req, res) {
    try {
      const { email } = req.body;
      if (!email)
        return res.status(409).send({ message: "Missing Email{email}" });
      const userExits = await User.findOne({ where: { email } });
      if (userExits) return res.status(200).send({ data: true });

      return res.status(200).send({ data: false });
    } catch (error) {
      throw new Error(error);
    }
  }
  static async getUserProfile(req, res) {
    try {
      const me = await User.findOne({
        where: { id: req.user.id },
        attributes: { exclude: ["password"] },
        raw: true,
      });
      if (!me) return res.status(404).send({ message: "User not found" });

      const { password, ...rest } = me;

      return res.status(200).send({ user: { ...rest } });
    } catch (error) {
      throw new Error(error);
    }
  }

  static async getAdminProfile(req, res) {
    try {
      const me = await AdminUser.findOne({
        where: { id: req.user.id },
        attributes: { exclude: ["password"] },
        raw: true,
      });
      if (!me) return res.status(404).send({ message: "User not found" });

      const { password, ...rest } = me;

      return res.status(200).send({ user: { ...rest } });
    } catch (error) {
      throw new Error(error);
    }
  }

  static async getUserName(req, res) {
    try {
      const me = await User.findOne({
        where: { id: req.user.id },
        attributes: { exclude: ["password"] },
        raw: true,
      });
      if (!me) return res.status(404).send({ message: "User not found" });

      const { password, ...rest } = me;

      return res
        .status(200)
        .send({ user: { firstName: me.firstName, lastName: me.lastName } });
    } catch (error) {
      throw new Error(error);
    }
  }
}

export default AuthController;
