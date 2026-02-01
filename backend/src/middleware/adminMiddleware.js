export const adminOnly = (req, res, next) => {
  try {
    // user must be logged in (protect middleware already ran)
    if (!req.user) {
      return res.status(401).json({
        message: "Not authenticated ❌",
      });
    }

    // role-based admin check
    if (req.user.role !== "admin") {
      return res.status(403).json({
        message: "Admin access only ❌",
      });
    }

    next();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
