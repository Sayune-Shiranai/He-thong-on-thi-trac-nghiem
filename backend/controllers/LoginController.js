const db = require('../models/index.js');
const bcrypt = require('bcrypt');
const { Op } = require("sequelize");
const {
  generateAccessToken,
  generateRefreshToken
} = require("../utils/jwt.js");

// Login user
const Login = async (req, res) => {
  const { username, password } = req.body;
    if (!username)
        return res.status(400).json({ field: "username", message: "Vui lòng nhập tên đăng nhập!" });
    if (!password)
        return res.status(400).json({ field: "password", message: "Vui lòng nhập mật khẩu!" });

    const user = await db.User.findOne({
        where: {
            [Op.or]: [
                { username: username },
                { email: username }
            ]
        },
        include: [
            {
                model: db.Role
            },
            {
                model: db.Status
            }
        ]
    });

    if (user){
        if (user.Status && user.Status.name !== "Approved") {
            return res.status(403).json({ message: "Tài khoản đã bị khóa!"});
        }
        //example bcrypt.compare("123456", "$2b$10$gSY0P4HkHnNR3qDnPKhLVeFbf...vSVK/UZb4qB0E6") 
        //bcrypt sẽ hash lại "123456" theo cùng cơ chế salt và so sánh với chuỗi hash trong DB.
        const checkPassword = await bcrypt.compare(password, user.password);
        if (checkPassword) {
            const accessToken = generateAccessToken(user);
            const refreshToken = generateRefreshToken(user);

            user.refreshToken = refreshToken;

            await user.save();

            res.cookie("accessToken", accessToken, { httpOnly: true, sameSite: "lax", path: "/" });
            res.cookie("refreshToken", refreshToken, { httpOnly: true, sameSite: "lax", path: "/" });

            return res.status(200).json({ 
                message: "Đăng nhập thành công!", 
                user: { 
                    id: user.id, 
                    username: user.username, 
                    email: user.email,
                    role_id: user.role_id,
                    role_name: user.Role.name,
                }, 
                accessToken,
                refreshToken
            });
        }else {
            return res.status(400).json({ field: "password", message: "Mật khẩu không đúng!" });
        }
    }else {
        return res.status(400).json({ field: "username", message: "Tài khoản không tồn tại!" });
    }
}

module.exports = {
  Login
};