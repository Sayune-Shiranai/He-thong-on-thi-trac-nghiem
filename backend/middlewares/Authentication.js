const jwt = require("jsonwebtoken");
const AsyncLock = require("async-lock");
const db = require("../models/index.js");

const lock = new AsyncLock();

const JWT_SECRET = process.env.JWT_SECRET;

const Authentication = async (req, res, next) => {
  console.log("Cookie accessToken:", req.cookies.accessToken);
  console.log("Cookie refreshToken:", req.cookies.refreshToken);

  if (req.cookies && req.cookies.accessToken) {
    req.user = null;
    const currentUrl = req.url;
    try {
      const CheckAccessToken = await jwt.verify(
        req.cookies.accessToken,
        JWT_SECRET
      );
      req.user = CheckAccessToken;
      // console.log("AccessToken hợp lệ:", CheckAccessToken);

      console.log("Giá trị của currentUrl:", currentUrl);
      return next();
    } catch (error) {
      console.log("Giá trị của currentUrl:", currentUrl);

      //kiểm tra refresh token
      if (req.cookies.refreshToken) {
        // console.log("Giá trị của cookie refreshToken:", req.cookies.refreshToken);
        try {
          const CheckRefreshToken = jwt.verify(
            req.cookies.refreshToken,
            JWT_SECRET
          );
          req.user = CheckRefreshToken;
          // console.log(CheckRefreshToken);
          const userData = await lock.acquire(`refresh_lock_${CheckRefreshToken.id}`, async () => {
            console.log("Xác thực refresh token thành công!")

            const User = await db.User.findOne({
              where: { id: CheckRefreshToken.id },
                include: {
                  model: db.Role,
                }
            });

            if (!User) return null;

            if (User.refreshToken !== req.cookies.refreshToken) {
              return {
                id: User.id,
                username: User.username,
                role_id: User.role_id
              };
            }
            
            // console.log("Giá trị của cookie.refreshToken:", req.cookies.refreshToken);
            // console.log("Giá trị của User.refreshToken:", User.refreshToken);

            if (User && User.refreshToken === req.cookies.refreshToken) {
              // console.log("Giá trị của User.username:", User.username);
              // console.log("Giá trị của User.role:", User.User_Role.role);

              const newAccessToken = jwt.sign(
                { 
                  id: User.id, 
                  username: User.username, 
                  role_id: User.role_id 
                },
                JWT_SECRET,
                { expiresIn: "15m" }
              );

              const newRefreshToken = jwt.sign(
                { 
                  id: User.id, 
                },
                JWT_SECRET,
                { expiresIn: "7d" }
              );

              const UpdateRefreshToken = await db.User.update(
                { refreshToken: newRefreshToken },
                { where: { id: User.id } }
              );

              console.log("UpdateRefreshToken:", UpdateRefreshToken);

              res.cookie("accessToken", newAccessToken, { 
                  httpOnly: true,
                  sameSite: "lax",
                  path: "/",
              });
              console.log("Giá trị của newAccessToken:", newAccessToken);

              res.cookie("refreshToken", newRefreshToken, {
                  httpOnly: true,
                  sameSite: "lax",
                  path: "/",
              });
              console.log("Giá trị của newRefreshToken mới:", newRefreshToken);

              return {
                id: User.id,
                username: User.username,
                role_id: User.role_id,
              };
              
            }
            //  else {
            //   console.log("Request song song phát hiện: Đã có luồng khác cập nhật token.");
            //   // Gán user từ DB để đi tiếp vào Controller, không cần tạo mới nữa
            //   req.user = { id: User.id, username: User.username, role: User.User_Role.role };
            // }
          });

          if (!userData) {
            return res.status(401).json({ message: "Token không hợp lệ" });
          }

          req.user = userData;

          // console.log("Giá trị của currentUrl:", currentUrl);
          console.log("Xác thực user thành công!")
          return next();
        } catch (err) {
          res.clearCookie("accessToken");
          res.clearCookie("refreshToken");
          return res.status(401).send({
              message: "Token hết hạn!",
          });
        }
      } else {
        return res.status(401).send({ 
          message: "Lỗi xác thực refresh token!" 
        });
      }
    }
  } else {
    return res.status(401).send({ 
      message: "Chưa đăng nhập" 
    });
  }
}

module.exports = Authentication;