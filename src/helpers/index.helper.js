import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Op, Sequelize } from "sequelize";
import db from "../../models";
const { SubCategory } = db;

class App {
  static hashPassword(password) {
    const hash = bcrypt.hashSync(password, 8);
    return hash;
  }
  static isEmpty(value) {
    {
      return (
        value === undefined || value.toString() === undefined ||
        value === null ||
        (typeof value === 'object' && Object.keys(value).length === 0) ||
        (typeof value === 'string' && value.trim().length === 0)
      );
    };
  }
  static isPasswordEqual(plainPassword, hashPassword) {
    return bcrypt.compareSync(plainPassword, hashPassword);
  }
  static generateUUID() {
    return uuidv4();
  }
  static assignToken(payload, expiresTime) {
    const token = jwt.sign(
      payload,
      process.env.SECRET_KEY || "charlesisawseosome",
      {
        expiresIn: expiresTime ? expiresTime : "2h",
      }
    );
    return token;
  }
  static decodeToken(token) {
    return new Promise((resolve, reject) => {
      try {
        const decoded = jwt.verify(
          token,
          process.env.SECRET_KEY || "charlesisawesome"
        );
        resolve(decoded);
      } catch (error) {
        reject(error);
      }
    });
  }

  static checkExpirationTime(expirationTime) {

    const tzoffset = (new Date()).getTimezoneOffset() * 60000;
    // const currentTime = (new Date(Date.now() - tzoffset)).toISOString();
    const currentTime = (new Date(Date.now() - tzoffset)).toLocaleString().split(',')[0]
    const expirationTimeDay = (new Date(expirationTime)).toLocaleString().split(',')[0]

    try {
      if (new Date(currentTime).getTime() >= new Date(expirationTimeDay).getTime())
        return true
      return false
    } catch (er) {
      throw new Error(er);

    }

  }


  static imageFileFilter(req, file, cb) {
    try {
      if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/))
        return cb(new Error('You can upload only image files!'), false);
      cb(null, true);

    } catch (error) {
      throw new Error(error);
    }
  };


  static pagenation(page, size) {
    const limit = size ? +size : 24;
    const offset = page ? page * limit : 0;
    return { limit, offset };
  };

  static getPagingData(data, page, limit) {
    const { count: totalItems, rows: products } = data;
    const currentPage = page ? +page : 0;
    const totalPages = Math.ceil(totalItems / limit);
    return { totalItems, products, totalPages, currentPage };
  };

  static queryCondition(req) {
    const where = {}
    const include = []
    const order = []
    where[IS_ACTIVE] = true;
    const { title, minPrice, MaxPrice, sortedBy, rating, category } = req.query
    if (category)
      if (Array.isArray(category)) {
        include.push({
          model: SubCategory,
          where: {
            name: {
              [Op.in]: category
            }
          }
        })
      } else {
        include.push({
          model: SubCategory,
          where: {
            name: {
              [Op.like]: `%${category}%`
            }
          }
        })
      }

    if (title)
      where[NAME] = { [Op.like]: `%${title}%` }
    if (minPrice && MaxPrice && !isNaN(minPrice) && !isNaN(minPrice))
      where[SELLING_PRICE] = { [Op.between]: [`${minPrice}`, `${MaxPrice}`] }

    if (rating && !isNaN(rating)) {
      where[AVERAGE_RATING] = { [Op.gte]: `${rating}` }
    }
    switch (sortedBy) {
      case PRICE_HL:
        order.push(Sequelize.literal(SELLING_PRICE_DESC))
        break;
      case PRICE_LH:
        order.push(Sequelize.literal(SELLING_PRICE_ASC))
        break;
      case NEW:
        order.push(Sequelize.literal(CREATED_DESC))
        break;
      default: BEST_SELLING
    };
    return { where, order, include }
  }

  static randomString(len) {
    var char = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    return [...Array(len)].reduce(a => a + char[~~(Math.random() * char.length)], '');

  }

}

export default App;
