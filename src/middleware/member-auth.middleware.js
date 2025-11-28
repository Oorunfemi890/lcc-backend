import App from "../helpers/index.helper";

class MemberAuthMiddleware {
    static async verifyMemberToken(req, res, next) {
        try {
            const token = req.headers["authorization"].split(" ")[1] || req.headers["authorization"]
            if (!token) {
                return res.status(401).send({ message: "Authorization required" });
            }

            const decoded = await App.decodeToken(token);

            // Ensure this is a member token (not admin)
            if (!decoded.memberId) {
                return res.status(401).send({ message: "Invalid member token" });
            }

            req.user = decoded;
            next();
        } catch (error) {
            console.error("Member auth error:", error);
            res.status(401).send({ message: "Invalid or expired token" });
        }
    }
}

export default MemberAuthMiddleware;
