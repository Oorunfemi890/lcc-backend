import db from "../../models";
import { Op } from "sequelize";

const { Attendance } = db;

class AttendanceController {
    // Create new attendance record
    static async createAttendance(req, res) {
        try {
            const {
                date,
                serviceType,
                menCount,
                womenCount,
                adults, // Frontend sends 'adults', map to 'adultsCount'
                youth,  // Frontend sends 'youth', map to 'youthCount'
                visitors, // Frontend sends 'visitors', map to 'visitorsCount'
                children, // Frontend sends 'children' (used for childrenCount)
                childrenCount, // Legacy support
                notes
            } = req.body;

            // Check if record already exists for this date and service type? 
            // Optional, but good to prevent duplicates. 
            // For now, let's allow multiple (e.g. multiple services per day) 
            // unless user enforced uniqueness.

            const newAttendance = await Attendance.create({
                date,
                serviceType,
                menCount: parseInt(menCount) || 0,
                womenCount: parseInt(womenCount) || 0,
                adultsCount: parseInt(adults) || 0,
                youthCount: parseInt(youth) || 0,
                visitorsCount: parseInt(visitors) || 0,
                childrenCount: parseInt(children || childrenCount) || 0,
                notes
            });

            return res.status(201).send({
                message: "Attendance record created successfully",
                data: newAttendance
            });

        } catch (error) {
            console.error("Error creating attendance:", error);
            return res.status(500).send({ message: "Internal server error" });
        }
    }

    // Get all attendance records (with filters & pagination)
    static async getAllAttendance(req, res) {
        try {
            let { page = 1, limit = 10, search, startDate, endDate, serviceType } = req.query;
            page = parseInt(page);
            limit = parseInt(limit);
            const offset = (page - 1) * limit;

            const where = {};

            if (serviceType && serviceType !== 'all') {
                where.serviceType = serviceType;
            }

            if (startDate && endDate) {
                where.date = {
                    [Op.between]: [startDate, endDate]
                };
            } else if (startDate) {
                where.date = {
                    [Op.gte]: startDate
                };
            }

            if (search) {
                // Search by notes or service type
                where[Op.or] = [
                    { serviceType: { [Op.iLike]: `%${search}%` } },
                    { notes: { [Op.iLike]: `%${search}%` } }
                ];
            }

            const { count, rows } = await Attendance.findAndCountAll({
                where,
                limit,
                offset,
                order: [["date", "DESC"], ["createdAt", "DESC"]]
            });

            return res.status(200).send({
                message: "Attendance records fetched successfully",
                pagination: {
                    total: count,
                    page,
                    pages: Math.ceil(count / limit),
                    limit,
                },
                data: rows,
            });

        } catch (error) {
            console.error("Error fetching attendance records:", error);
            return res.status(500).send({ message: "Internal server error" });
        }
    }

    // Get single attendance record
    static async getOneAttendance(req, res) {
        try {
            const { id } = req.params;
            const attendance = await Attendance.findByPk(id);

            if (!attendance) {
                return res.status(404).send({ message: "Attendance record not found" });
            }

            return res.status(200).send({ message: "Attendance record fetched successfully", data: attendance });
        } catch (error) {
            console.error("Error fetching attendance record:", error);
            return res.status(500).send({ message: "Internal server error" });
        }
    }

    // Update attendance record
    static async updateAttendance(req, res) {
        try {
            const { id } = req.params;
            const { menCount, womenCount, childrenCount } = req.body;

            // If counts are updated, ensure total is recalculated (hook handles this if we use save/update correctly, 
            // but update() might skip hooks depending on options. 
            // Best to explicit update or let individual: true in options, but direct update is safer).
            // However, calculating total here is safer before sending to DB if hooks are tricky with bulk update.

            let updateData = { ...req.body };

            // Recalculate total if any count is present in body
            if (menCount !== undefined || womenCount !== undefined || childrenCount !== undefined ||
                req.body.adults !== undefined || req.body.youth !== undefined || req.body.visitors !== undefined || req.body.children !== undefined) {
                // We might need existing values if only partial update? 
                // Simple update: assume user sends full counts or we fetch first. 
                // Let's fetch first to be safe for partial updates.
                const existing = await Attendance.findByPk(id);
                if (!existing) return res.status(404).send({ message: "Record not found" });

                const men = menCount !== undefined ? parseInt(menCount) : existing.menCount;
                const women = womenCount !== undefined ? parseInt(womenCount) : existing.womenCount;
                const adults = req.body.adults !== undefined ? parseInt(req.body.adults) : existing.adultsCount;
                const youth = req.body.youth !== undefined ? parseInt(req.body.youth) : existing.youthCount;
                const visitors = req.body.visitors !== undefined ? parseInt(req.body.visitors) : existing.visitorsCount;
                // 'children' from new form or 'childrenCount' legacy
                const childrenVal = req.body.children !== undefined ? parseInt(req.body.children) :
                    (childrenCount !== undefined ? parseInt(childrenCount) : existing.childrenCount);

                updateData.adultsCount = adults;
                updateData.youthCount = youth;
                updateData.visitorsCount = visitors;
                updateData.childrenCount = childrenVal;

                updateData.total = men + women + adults + youth + visitors + childrenVal;
            }

            const [updated] = await Attendance.update(updateData, { where: { id } });

            if (!updated) {
                // note: updated is 0 if no rows changed (even if found but values same)
                // or if not found. We checked exists above. 
                // Just return new data.
            }

            const updatedAttendance = await Attendance.findByPk(id);
            return res.status(200).send({ message: "Attendance updated successfully", data: updatedAttendance });

        } catch (error) {
            console.error("Error updating attendance:", error);
            return res.status(500).send({ message: "Internal server error" });
        }
    }

    // Delete attendance record
    static async deleteAttendance(req, res) {
        try {
            const { id } = req.params;
            const deleted = await Attendance.destroy({ where: { id } });

            if (!deleted) {
                return res.status(404).send({ message: "Attendance record not found" });
            }

            return res.status(200).send({ message: "Attendance record deleted successfully" });
        } catch (error) {
            console.error("Error deleting attendance:", error);
            return res.status(500).send({ message: "Internal server error" });
        }
    }

    // Get attendance statistics
    static async getStats(req, res) {
        try {
            const totalRecords = await Attendance.count();

            const totalAttendance = await Attendance.sum('total') || 0;
            const totalAdults = await Attendance.sum('adultsCount') || 0;
            const totalYouth = await Attendance.sum('youthCount') || 0;
            const totalChildren = await Attendance.sum('childrenCount') || 0;
            const totalVisitors = await Attendance.sum('visitorsCount') || 0;

            // Get this month's stats
            const now = new Date();
            const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
            const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

            const thisMonthRecords = await Attendance.count({
                where: {
                    date: {
                        [Op.between]: [firstDayOfMonth, lastDayOfMonth]
                    }
                }
            });

            const thisMonthAttendance = await Attendance.sum('total', {
                where: {
                    date: {
                        [Op.between]: [firstDayOfMonth, lastDayOfMonth]
                    }
                }
            }) || 0;

            return res.status(200).send({
                message: "Attendance statistics retrieved successfully",
                data: {
                    totalRecords,
                    totalAttendance,
                    totalAdults,
                    totalYouth,
                    totalChildren,
                    totalVisitors,
                    thisMonthRecords,
                    thisMonthAttendance,
                    averageAttendance: totalRecords > 0 ? Math.round(totalAttendance / totalRecords) : 0
                }
            });
        } catch (error) {
            console.error("Error fetching attendance stats:", error);
            return res.status(500).send({ message: "Internal server error" });
        }
    }
}

export default AttendanceController;
