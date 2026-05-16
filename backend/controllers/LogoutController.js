const db = require('../models/index.js');

const Logout = async (req, res) => {

  const refreshToken = req.cookies.refreshToken;

  if (refreshToken) {

    const user = await db.User.findOne({
      where: { refreshToken }
    });

    if (user) {
      user.refreshToken = null;
      await user.save();
    }
  }

  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");

  return res.json({
    message: "Đăng xuất thành công"
  });

};

module.exports = {
  Logout
};