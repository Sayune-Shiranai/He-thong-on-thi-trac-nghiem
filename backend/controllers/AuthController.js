// const jwt = require("jsonwebtoken");

// const {
//   generateAccessToken,
//   generateRefreshToken
// } = require("../utils/jwt");

// const RefreshToken = async (req, res) => {

//   try {

//     const refreshToken = req.cookies.refreshToken;

//     if (!refreshToken) {
//       return res.status(401).json({
//         message: "Không có refresh token"
//       });
//     }

//     // verify token

//     const decoded = jwt.verify(
//       refreshToken,
//       process.env.JWT_REFRESH_SECRET
//     );

//     // tìm user

//     const user = await db.User.findByPk(decoded.id);

//     if (!user) {
//       return res.status(404).json({
//         message: "User không tồn tại"
//       });
//     }

//     // check token trong DB

//     if (user.refreshToken !== refreshToken) {
//       return res.status(403).json({
//         message: "Refresh token không hợp lệ"
//       });
//     }

//     // tạo token mới

//     const newAccessToken = generateAccessToken(user);

//     const newRefreshToken = generateRefreshToken(user);

//     // rotation
//     user.refreshToken = newRefreshToken;

//     await user.save();

//     // set cookie mới

//     res.cookie("accessToken", newAccessToken, {
//       httpOnly: true,
//       secure: false,
//       sameSite: "lax"
//     });

//     res.cookie("refreshToken", newRefreshToken, {
//       httpOnly: true,
//       secure: false,
//       sameSite: "lax"
//     });

//     return res.json({
//       accessToken: newAccessToken,
//       refreshToken: newRefreshToken
//     });

//   } catch (err) {

//     return res.status(403).json({
//       message: "Refresh token hết hạn hoặc sai"
//     });

//   }

// };

// module.exports = {
//   RefreshToken
// };