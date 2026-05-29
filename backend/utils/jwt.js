const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;

const generateAccessToken = (user) => {
    return jwt.sign(
        {
            id: user.id,
            username: user.username,
            email: user.email,
            role_id: user.role_id,
            role: user.Role.name
        },
        JWT_SECRET,
        { expiresIn: "2m"}
    );
};

const generateRefreshToken = (user) => {
    return jwt.sign(
        {
            id: user.id,
            username: user.username,
            email: user.email,
            role_id: user.role_id,
            role: user.Role.name
        },
        JWT_SECRET,
        { expiresIn: "5m" }
    );
};

module.exports = {
  generateAccessToken,
  generateRefreshToken
};