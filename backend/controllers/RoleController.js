const db = require('../models/index.js');
const { Op } = require('sequelize');

//lấy danh sách role theo phân trang
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
          { name: { [Op.like]: `%${keyword}%` } }
        ]
      };
    }

    const totalRecords = await db.Role.count({ where });

    // Lấy danh sách role + user theo trang
    const role = await db.Role.findAll({
      where,
      include: [
        {
          model: db.User,
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
      data: role
    });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

// create role
const CreateRole = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name || name.trim() === "") {
      return res.status(400).json({ error: "Vui lòng nhập tên role!" });
    }

    const checkRole = await db.Role.findOne({
      where: { name }
    });

    if (checkRole) {
      return res.status(400).json({
        success: false,
        message: "Role đã tồn tại!"
      });
    }

    const newRole = await db.Role.create({ name });

    return res.status(201).json({
      message: "Tạo role thành công!",
      name: newRole
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

// update role
const UpdateRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    if (!name || name.trim() === "") {
      return res.status(400).json({ error: "Vui lòng nhập role!" });
    }

    const CheckRole = await db.Role.findOne({
      where: { id }
    });

    if (!CheckRole) {
      return res.status(404).json({ error: "Không tìm thấy role" });
    }

  await CheckRole.update({ name });

    return res.json(
      {
        message: "Cập nhật role thành công!",
        data: CheckRole
      }
    );
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

// delete role
const DeleteRole = async (req, res) => {
  try {
    const { id } = req.params;
    const role = await db.Role.findOne(
      { where: { id } }
    );
    if (!role) {
      return res.status(404).json({ error: "Không tìm thấy role!" });
    }

    const userCount = await db.User.count({
      where: { role_id: id }
    });

    if (userCount > 0) {
      return res.status(400).json({
        error: "Không thể xóa vai trò đang được sử dụng!"
      });
    }

    await role.destroy();
    return res.json({ message: "Xóa role thành công!" });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

const GetAllRoles = async (req, res) => {
  try {
    const roles = await db.Role.findAll();
    return res.json(roles);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

module.exports = {
  GetPaged,
  CreateRole,
  UpdateRole,
  DeleteRole,
  GetAllRoles
};

