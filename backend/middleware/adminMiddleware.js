const User = require("../models/User");

const authorizeRoles = (...allowedRoles) => {
    return async (req, res, next) => {
        try {
            if (!req.user) {
                return res.status(401).json({ success: false, message: "Unauthorized access" });
            }

            const user = await User.findById(req.user.id);
            if (!user) {
                return res.status(404).json({ success: false, message: "User not found" });
            }

            // Temporarily allow 'admin' role as well for backward compatibility until DB migration is complete
            if (!allowedRoles.includes(user.role) && user.role !== 'admin') {
                return res.status(403).json({ 
                    success: false, 
                    message: "Access Denied: You do not have permission to view this clinical resource." 
                });
            }

            next();
        } catch (error) {
            console.error("RBAC Middleware Error:", error);
            res.status(500).json({ success: false, error: "Server error during role verification" });
        }
    };
};

module.exports = authorizeRoles;
