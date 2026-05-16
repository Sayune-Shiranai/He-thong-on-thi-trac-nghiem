// const jwt = require("jsonwebtoken");

// const Authentication = (req, res, next) => {

//   const authHeader = req.headers.authorization;

//   if (!authHeader) {
//     return res.status(401).json({
//       message: "Chưa đăng nhập"
//     });
//   }

//   const token = authHeader.split(" ")[1];

//   jwt.verify(
//     token,
//     process.env.JWT_ACCESS_SECRET,
//     (err, user) => {

//       if (err) {
//         return res.status(403).json({
//           message: "Token không hợp lệ"
//         });
//       }

//       req.user = user;

//       next();
//     }
//   );
// };

// module.exports = Authentication;