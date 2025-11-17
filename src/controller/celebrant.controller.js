import db from "../../models";
import { Op } from "sequelize";

const Celebrant = db.Celebrant;

class CelebrantController {
  /**
   * Create Celebrant
   */
  static async createCelebrant(req, res) {
    try {
      const {
        memberId,
        name,
        celebrationType,
        celebrationDate,
        contact,
        message,
      } = req.body;
      const photoUrl = req.fileUrl
            console.log("photoUrl: ", photoUrl);

      if (!name || !celebrationType || !celebrationDate || !contact) {
        return res.status(400).send({
          message:
            "Missing required fields: {name} {celebrationType} {celebrationDate} {contact}",
        });
      }

      const celebrant = await Celebrant.create({
        name,
        celebrationType,
        celebrationDate,
        contact,
        message,
        specialRequests:message,
        photoUrl,
      });

      return res
        .status(201)
        .send({ message: "Celebrant created successfully" });
    } catch (error) {
      console.log("Error creating celebrant: ", error);
      return res.status(500).send({ message: "Internal server error" });
    }
  }

  /**
   * Update Celebrant
   */
  static async updateCelebrant(req, res) {
    try {
      const { id } = req.params;
      const updates = req.body;

      const celebrant = await Celebrant.findOne({ where: { id } });
      if (!celebrant) {
        return res.status(404).send({ message: "Celebrant not found" });
      }

      await Celebrant.update(updates, { where: { id } });

      const updatedCelebrant = await Celebrant.findOne({ where: { id } });

      return res.status(200).send({
        message: "Celebrant updated successfully",
        celebrant: updatedCelebrant,
      });
    } catch (error) {
      console.log("Error updating celebrant: ", error);
      return res.status(500).send({ message: "Internal server error" });
    }
  }

  /**
   * Delete Celebrant
   */
  static async deleteCelebrant(req, res) {
    try {
      const { id } = req.params;

      const celebrant = await Celebrant.findOne({ where: { id } });
      if (!celebrant) {
        return res.status(404).send({ message: "Celebrant not found" });
      }

      await Celebrant.destroy({ where: { id } });

      return res
        .status(200)
        .send({ message: "Celebrant deleted successfully" });
    } catch (error) {
      console.log("Error deleting celebrant: ", error);
      return res.status(500).send({ message: "Internal server error" });
    }
  }

  /**
   * Find All Celebrants (Paginated + Filters)
   */
  static async findAllCelebrants(req, res) {
    try {
      const {
        page = 1,
        limit = 10,
        name,
        celebrationType,
        isPublic,
        active,
      } = req.query;

      const offset = (parseInt(page) - 1) * parseInt(limit);
      const where = {};

      if (name) {
        where.name = { [Op.iLike]: `%${name}%` }; // case-insensitive search
      }
      if (celebrationType) {
        where.celebrationType = celebrationType;
      }
      if (isPublic !== undefined) {
        where.isPublic = isPublic === "true";
      }
      if (active !== undefined) {
        where.active = active === "true";
      }

      const { rows, count } = await Celebrant.findAndCountAll({
        where,
        limit: parseInt(limit),
        offset,
        order: [["celebrationDate", "ASC"]],
      });

      return res.status(200).send({
        message: "Celebrants fetched successfully",
        total: count,
        page: parseInt(page),
        pages: Math.ceil(count / limit),
        celebrants: rows,
      });
    } catch (error) {
      console.log("Error fetching celebrants: ", error);
      return res.status(500).send({ message: "Internal server error" });
    }
  }
}

export default CelebrantController;
