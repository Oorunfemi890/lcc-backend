import db from "../../models";
// import App from "../helpers";

const { User } = db;

class UserController {
  static async getAllUsers(req, res) {
    try {
      const users = await User.findAll({
        attributes: { exclude: ["password"] },
      });

      return res
        .status(200)
        .send({ message: "operation succefful", data: users });
    } catch (error) {
      throw error;
    }
  }

  static async blockUser(req, res) {
    try {
      const param = req.params;

      await User.update(
        { active: false, blockReason: req.body.reason },
        {
          where: {
            id: +param.id,
          },
        }
      );

      return res.status(200).send({ message: "operation success" });
    } catch (error) {
      throw error;
    }
  }

  static async unBlockUser(req, res) {
    try {
      const param = req.params;

      await User.update(
        { active: true },
        {
          where: {
            id: +param.id,
          },
        }
      );

      return res.status(200).send({ message: "operation success" });
    } catch (error) {
      throw error;
    }
  }
}

export default UserController;
