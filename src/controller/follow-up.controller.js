import db from "../../models";
const { FollowUp, FirstTimer, Member } = db;

class FollowUpController {
  // ✅ Create a follow-up
  static async createFollowUp(req, res) {
    try {
      const {
        firstTimerId,
        assignedToMemberId,
        followUpType,
        scheduledDate,
        notes,
        nextFollowUpDate,
      } = req.body;

      if (!firstTimerId || !followUpType || !scheduledDate) {
        return res
          .status(400)
          .send({ message: "Missing required fields: {firstTimerId, followUpType, scheduledDate}" });
      }

      const followUp = await FollowUp.create({
        firstTimerId,
        assignedToMemberId,
        followUpType,
        scheduledDate,
        notes,
        nextFollowUpDate,
      });

      const fullFollowUp = await FollowUp.findByPk(followUp.id, {
        include: [
          { model: FirstTimer, as: "firstTimer", attributes: ["id", "firstName", "lastName", "phoneNumber"] },
          { model: Member, as: "assignedMember", attributes: ["id", "firstName", "lastName", "membershipType"] },
        ],
      });

      return res.status(201).send({
        message: "Follow-up created successfully",
        data: fullFollowUp,
      });
    } catch (error) {
      console.error("Error creating follow-up:", error);
      return res.status(500).send({ message: "Internal server error" });
    }
  }

// ✅ Get all follow-ups (paginated + filter by queries)
static async getAllFollowUps(req, res) {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      followUpType,
      assignedToMemberId,
      firstTimerId,
      startDate,
      endDate,
    } = req.query;

    const where = {};

    if (status) where.status = status;
    if (followUpType) where.followUpType = followUpType;
    if (assignedToMemberId) where.assignedToMemberId = assignedToMemberId;
    if (firstTimerId) where.firstTimerId = firstTimerId;

    // Date range filter (scheduledDate)
    if (startDate && endDate) {
      where.scheduledDate = {
        [db.Sequelize.Op.between]: [startDate, endDate],
      };
    } else if (startDate) {
      where.scheduledDate = { [db.Sequelize.Op.gte]: startDate };
    } else if (endDate) {
      where.scheduledDate = { [db.Sequelize.Op.lte]: endDate };
    }

    const offset = (page - 1) * limit;

    const { count, rows } = await FollowUp.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset,
      order: [["scheduledDate", "DESC"]],
      include: [
        { model: FirstTimer, as: "firstTimer", attributes: ["id", "firstName", "lastName", "phoneNumber"] },
        { model: Member, as: "assignedMember", attributes: ["id", "firstName", "lastName", "membershipType"] },
      ],
    });

    return res.status(200).send({
      message: "Follow-ups retrieved successfully",
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(count / limit),
      },
      data: rows,
    });
  } catch (error) {
    console.error("Error fetching follow-ups:", error);
    return res.status(500).send({ message: "Internal server error" });
  }
}


  static async getFollowUpById(req, res) {
    try {
      const { id } = req.params;
      const followUp = await FollowUp.findByPk(id, {
        include: [
          { model: FirstTimer, as: "firstTimer", attributes: ["id", "firstName", "lastName", "phoneNumber"] },
          { model: Member, as: "assignedMember", attributes: ["id", "firstName", "lastName", "membershipType"] },
        ],
      });

      if (!followUp) {
        return res.status(404).send({ message: "Follow-up not found" });
      }

      return res.status(200).send({
        message: "Follow-up retrieved successfully",
        data: followUp,
      });
    } catch (error) {
      console.error("Error fetching follow-up:", error);
      return res.status(500).send({ message: "Internal server error" });
    }
  }

  // ✅ Update follow-up
  static async updateFollowUp(req, res) {
    try {
      const { id } = req.params;
      const [updated] = await FollowUp.update(req.body, { where: { id } });

      if (!updated) {
        return res.status(404).send({ message: "Follow-up not found" });
      }

      const updatedFollowUp = await FollowUp.findByPk(id, {
        include: [
          { model: FirstTimer, as: "firstTimer", attributes: ["id", "firstName", "lastName", "phoneNumber"] },
          { model: Member, as: "assignedMember", attributes: ["id", "firstName", "lastName", "membershipType"] },
        ],
      });

      return res.status(200).send({
        message: "Follow-up updated successfully",
        data: updatedFollowUp,
      });
    } catch (error) {
      console.error("Error updating follow-up:", error);
      return res.status(500).send({ message: "Internal server error" });
    }
  }

  // ✅ Delete follow-up
  static async deleteFollowUp(req, res) {
    try {
      const { id } = req.params;
      const deleted = await FollowUp.destroy({ where: { id } });

      if (!deleted) {
        return res.status(404).send({ message: "Follow-up not found" });
      }

      return res.status(200).send({ message: "Follow-up deleted successfully" });
    } catch (error) {
      console.error("Error deleting follow-up:", error);
      return res.status(500).send({ message: "Internal server error" });
    }
  }
}

export default FollowUpController;
