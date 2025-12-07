import db from "../../models";
import { Op } from "sequelize";

const { Member, Program, Celebrant } = db;

class DashboardController {

    /**
     * Get Dashboard Stats
     * Returns total members, active members, upcoming events count, pending celebrations
     */
    static async getStats(req, res) {
        try {
            const totalMembers = await Member.count();
            // Assuming 'active' is the field for active members. 
            // If active field is boolean.
            const activeMembers = await Member.count({ where: { active: true } });

            const upcomingEvents = await Program.count({
                where: { startDate: { [Op.gte]: new Date() } }
            });

            // Assuming 'active: false' indicates pending/unapproved celebrations
            const pendingCelebrations = await Celebrant.count({
                where: { active: false }
            });

            return res.status(200).json({
                success: true,
                data: {
                    totalMembers,
                    activeMembers,
                    upcomingEvents,
                    pendingCelebrations
                },
                message: "Stats retrieved successfully"
            });
        } catch (error) {
            console.error("Dashboard stats error:", error);
            return res.status(500).json({
                success: false,
                message: "Failed to fetch stats",
                error: error.message
            });
        }
    }

    /**
     * Get Quick Stats (Header)
     * Potentially same as getStats or a subset
     */
    static async getQuickStats(req, res) {
        // Reuse logic or simplify
        return DashboardController.getStats(req, res);
    }

    /**
     * Get Recent Activities
     * Combines latest Members and Programs
     */
    static async getRecentActivities(req, res) {
        try {
            const limit = 5;

            // Fetch latest members
            const recentMembers = await Member.findAll({
                limit,
                order: [['createdAt', 'DESC']],
                attributes: ['id', 'firstName', 'lastName', 'createdAt', 'profilePicture']
            });

            // Fetch latest programs
            const recentPrograms = await Program.findAll({
                limit,
                order: [['createdAt', 'DESC']],
                attributes: ['id', 'name', 'createdAt', 'imageUrl'] // map name -> title if needed
            });

            // Normalize and merge
            const activities = [
                ...recentMembers.map(m => ({
                    id: m.id,
                    type: 'member',
                    title: `New member joined: ${m.firstName} ${m.lastName}`,
                    time: m.createdAt,
                    image: m.profilePicture
                })),
                ...recentPrograms.map(p => ({
                    id: p.id,
                    type: 'program',
                    title: `New program created: ${p.name}`,
                    time: p.createdAt,
                    image: p.imageUrl
                }))
            ];

            // Sort combined list by time DESC
            activities.sort((a, b) => new Date(b.time) - new Date(a.time));

            // Slice to limit
            const finalActivities = activities.slice(0, limit);

            return res.status(200).json({
                success: true,
                data: finalActivities,
                message: "Recent activities retrieved successfully"
            });
        } catch (error) {
            console.error("Dashboard activities error:", error);
            return res.status(500).json({
                success: false,
                message: "Failed to fetch recent activities",
                error: error.message
            });
        }
    }

    /**
     * Get Upcoming Events (Programs)
     */
    static async getUpcomingEvents(req, res) {
        try {
            const limit = parseInt(req.query.limit) || 5;

            const upcomingPrograms = await Program.findAll({
                where: {
                    startDate: {
                        [Op.gte]: new Date()
                    }
                },
                order: [['startDate', 'ASC']],
                limit
            });

            return res.status(200).json({
                success: true,
                data: upcomingPrograms,
                message: "Upcoming events retrieved successfully"
            });
        } catch (error) {
            console.error("Dashboard upcoming events error:", error);
            return res.status(500).json({
                success: false,
                message: "Failed to fetch upcoming events",
                error: error.message
            });
        }
    }

    /**
     * Get Member Growth Chart Data
     * Returns count of members joined per month for last 12 months
     */
    static async getChartData(req, res) {
        try {
            const { type, period } = req.query; // e.g. type=attendance, period=year

            // For now, only implementing Member Growth (default)
            // Logic: Group by month of createdAt

            const endDate = new Date();
            const startDate = new Date();
            startDate.setMonth(startDate.getMonth() - 11); // Last 12 months
            startDate.setDate(1); // Start of that month

            const members = await Member.findAll({
                where: {
                    createdAt: {
                        [Op.gte]: startDate,
                        [Op.lte]: endDate
                    }
                },
                attributes: ['createdAt']
            });

            // Process into monthly counts
            const monthlyData = {};
            // Initialize all 12 months with 0
            for (let d = new Date(startDate); d <= endDate; d.setMonth(d.getMonth() + 1)) {
                const key = d.toLocaleString('default', { month: 'short' });
                monthlyData[key] = 0;
            }

            members.forEach(m => {
                const key = new Date(m.createdAt).toLocaleString('default', { month: 'short' });
                if (monthlyData[key] !== undefined) {
                    monthlyData[key]++;
                }
            });

            // Convert to array format often used in charts: { name: 'Jan', value: 10 }
            const chartData = Object.entries(monthlyData).map(([name, value]) => ({
                name,
                value
            }));

            return res.status(200).json({
                success: true,
                data: chartData,
                message: "Chart data retrieved successfully"
            });

        } catch (error) {
            console.error("Dashboard chart data error:", error);
            return res.status(500).json({
                success: false,
                message: "Failed to fetch chart data",
                error: error.message
            });
        }
    }
}

export default DashboardController;
