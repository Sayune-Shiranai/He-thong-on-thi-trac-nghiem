const db = require('../models/index.js');
const { Op } = require('sequelize');

const GetPaged = async (req, res) => {
  try {
    let { page = 1, limit = 10, keyword = "" } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);

    const offset = (page - 1) * limit;

    let where = {};

    if (keyword) {
      where = {
        [Op.or]: [
          { username: { [Op.like]: `%${keyword}%` } },
          { email: { [Op.like]: `%${keyword}%` } }
        ]
      };
    }

    const totalRecords = await db.User.count({ where });

    const users = await db.User.findAll({
      where,
      include: [
        {
          model: db.Role,
        },
        {
          model: db.Status,
        }
      ],
      limit,
      offset,
      order: [["id", "DESC"]]
    });

    const totalPages = Math.ceil(totalRecords / limit);

    return res.json({
      page,
      limit,
      totalPages,
      totalRecords,
      data: users
    });

  } catch (err) {
    res.status(500).send(err.message);
  }
}

// Update user
const UpdateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { username, email, role_id } = req.body;

    const user = await db.User.findOne({
      where: { id }
    });

    if (!user) {
      return res.status(404).json({ success: false, message: "Không tìm thấy user!" });
    }

    if (username) user.username = username;
    if (email) user.email = email;
    if (role_id) user.role_id = role_id;

    await user.save();

    return res.json({
      success: true,
      message: "Cập nhật user thành công!",
      data: user
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, error: err.message });
  }
}

//delete user
const DeleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await db.User.findOne({
      where: { id }
    });
    if (!user) return res.status(404).json({ success: false, message: 'Không tìm thấy user!' });

    await user.destroy();
    res.json({ success: true, message: 'Xóa user thành công!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
}


const ApproveUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await db.User.findOne({
      where: { id }
    });
    if (!user) return res.status(404).json({ success: false, message: 'Không tìm thấy user!' });

    const status = await db.Status.findOne({
      where: { name: "Approved" }
    });

    if (!status) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy trạng thái!"
      });
    }

    user.status_id = status.id;

    await user.save();

    res.json({ success: true, message: 'Đã duyệt', data: user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
}

const RejectUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await db.User.findOne({
      where: { id }
    });
    if (!user) return res.status(404).json({ success: false, message: 'Không tìm thấy user!' });

    const status = await db.Status.findOne({
      where: { name: "Rejected" }
    });

    if (!status) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy trạng thái!"
      });
    }

    user.status_id = status.id;
    
    await user.save();

    res.json({ success: true, message: 'Hủy duyệt', data: user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
}

// Lấy thông tin user theo ID
const GetUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await db.User.findOne({
      where: { id },
      include: [
        {
          model: db.Role
        }
      ]
    });
    if (!user) return res.status(404).json({ success: false, message: 'Không tìm thấy user!' });

    res.json({ 
      success: true, 
      data: user 
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
}

// Lấy tất cả người dùng
const GetAllUsers = async (req, res) => {
  try {
    const users = await db.User.findAll();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

const GetAllUserRoleTeacher = async (req, res) => {
  try {
    const users = await db.User.findAll({
      include: [
        {
          model: db.Role,
          where: { name: "Teacher" }
        }
      ]
    });
    res.json({
      success: true,
      data: users
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
}

module.exports = {
  GetPaged,
  UpdateUser,
  DeleteUser,
  ApproveUser,
  RejectUser,
  GetUserById,
  GetAllUsers,
  GetAllUserRoleTeacher
};