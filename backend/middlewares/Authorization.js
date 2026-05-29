const Authorization = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        message: "Chưa đăng nhập"
      });
    }

    const allowedRoles = Array.isArray(roles) ? roles : [roles];

    console.log("req.user.ROLE =", req.user.role);
    console.log("allowedRoles =", allowedRoles);

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Tài khoản ${req.user.username} không đủ quyền truy cập`
      });
    }

    next();
  };
};

module.exports = Authorization;