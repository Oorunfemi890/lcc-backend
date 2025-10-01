import App from "../helpers/index.helper";

class AuthMiddleWare {
  static ADMIN_ROLES = ["SUPER ADMIN", "ADMIN"];
  static SUPER_ADMIN_ROLES = ["SUPER ADMIN"];

  static async verifyToken(req, res, next) {
    try {
      const token = req.headers["authorization"];

      if (!token)
        return res.status(401).send({ message: "Authorization failed" });
      const user = await App.decodeToken(token);
      req.user = user;
      next();
    } catch (error) {
      res.status(401).send({ message: "Authorization failed" });
    }
  }

  static async tokenOptional(req, res, next) {
    try {
      const token = req.headers["authorization"];
      let user = null;
      if (token) user = await App.decodeToken(token);

      req.user = user;
      next();
    } catch (error) {
      res.status(401).send({ message: "Authorization failed" });
    }
  }

  static async isAdmin(req, res, next) {
    try {
      const user = req.user;
      if (!user)
        return res.status(401).send({ message: "Authorization failed" });

      if (AuthMiddleWare.ADMIN_ROLES.includes(user.role)) {
        return next();
      }
      return res.status(401).send({
        message: "insufficient authorization please contact administrator",
      });
    } catch (error) {
      res.status(401).send({ message: "Authorization failed" });
    }
  }

  static async isSuperAdmin(req, res, next) {
    try {
      const user = req.user;
      if (!user)
        return res.status(401).send({ message: "Authorization failed" });

      if (AuthMiddleWare.SUPER_ADMIN_ROLES.includes(user.role)) {
        return next();
      }
      return res.status(401).send({
        message: "insufficient authorization please contact administrator",
      });
    } catch (error) {
      res.status(401).send({ message: "Authorization failed" });
    }
  }

  static async verifyTokenByID(req, res, next) {
    try {
      const token = req.params.tokenId;
      if (!token) {
        return res.status(401).send({ message: "Authorization failed" });
      }

      const user = await App.decodeToken(token);
      req.user = user;
      next();
    } catch (error) {
      res.status(401).send({ message: "Authorization failed" });
    }
  }
}

export default AuthMiddleWare;
