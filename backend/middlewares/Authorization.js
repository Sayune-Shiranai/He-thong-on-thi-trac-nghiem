// const Authorization = (...roles) => {

//   return (req, res, next) => {

//     if (!roles.includes(req.user.role_id)) {

//       return res.status(403).json({
//         message: "Không có quyền truy cập"
//       });
//     }

//     next();
//   };
// };

// module.exports = Authorization;