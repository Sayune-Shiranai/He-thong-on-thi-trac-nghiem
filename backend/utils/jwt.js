const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;

const generateAccessToken = (user) => {
    return jwt.sign(
        {
            id: user.id,
            username: user.username,
            email: user.email,
            role_id: user.role_id
        },
        JWT_SECRET,
        { expiresIn: "15m"}
    );
};

const generateRefreshToken = (user) => {
    return jwt.sign(
        {
            id: user.id
        },
        JWT_SECRET,
        { expiresIn: "7d" }
    );
};

module.exports = {
  generateAccessToken,
  generateRefreshToken
};