// middleware/protectRoute.js
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const protectRoute = async (req, res, next) => {
  try {
    let token = req.cookies.jwt;

    if (!token && req.headers.authorization?.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({ error: "Unauthorized: No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded?.userId) {
      return res.status(401).json({ error: "Unauthorized: Invalid token" });
    }

    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // ✅ Blocked user check
    if (user.isBlocked) {
      return res.status(403).json({ error: "Your account has been blocked due to policy violations." });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("JWT Error:", error.message);
    res.status(401).json({ error: error.message || "Invalid token" });
  }
};

export default protectRoute;
