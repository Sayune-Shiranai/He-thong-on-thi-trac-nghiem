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
// export async function updateUser(req, res) {
//   try {
//     const { id } = req.params;
//     const { username, email, role_id } = req.body;

//     const user = await db.usersModel.findOne({
//       where: { id }
//     });

//     if (!user) {
//       return res.status(404).json({ success: false, message: "Không tìm thấy user!" });
//     }

//     if (username) user.username = username;
//     if (email) user.email = email;
//     if (role_id) user.role_id = role_id;

//     await user.save();

//     return res.json({
//       success: true,
//       message: "Cập nhật user thành công!",
//       data: user
//     });

//   } catch (err) {
//     console.error(err);
//     return res.status(500).json({ success: false, error: err.message });
//   }
// }


// export async function deleteUser(req, res) {
//   try {
//     const { id } = req.params;

//     const user = await db.usersModel.findOne({
//       where: { id }
//     });
//     if (!user) return res.status(404).json({ success: false, message: 'Không tìm thấy user!' });

//     await user.destroy();
//     res.json({ success: true, message: 'Xóa user thành công!' });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ success: false, error: err.message });
//   }
// }


// export async function approveUser(req, res) {
//   try {
//     const { id } = req.params;
//     const user = await db.usersModel.findOne({
//       where: { id }
//     });
//     if (!user) return res.status(404).json({ success: false, message: 'Không tìm thấy user!' });

//     user.trangthai = 1;
//     await user.save();

//     res.json({ success: true, message: 'Đã duyệt', data: user });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ success: false, error: err.message });
//   }
// }

// export async function rejectUser(req, res) {
//   try {
//     const { id } = req.params;
//     const user = await db.usersModel.findOne({
//       where: { id }
//     });
//     if (!user) return res.status(404).json({ success: false, message: 'Không tìm thấy user!' });

//     user.trangthai = 2;
//     await user.save();

//     res.json({ success: true, message: 'Hủy duyệt', data: user });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ success: false, error: err.message });
//   }
// }

// // Lấy thông tin user theo ID
// export async function getUserById(req, res) {
//   try {
//     const { id } = req.params;
//     const user = await db.usersModel.findOne({
//       where: { id },
//       include: [
//         {
//           model: db.roleModel,
//           as: "User_Role"
//         }
//       ]
//     });
//     if (!user) return res.status(404).json({ success: false, message: 'Không tìm thấy user!' });

//     res.json({ success: true, data: user });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ success: false, error: err.message });
//   }
// }

// // Lấy tất cả người dùng
// export async function getAllUsers(req, res) {
//   try {
//     const users = await db.usersModel.findAll();
//     res.json(users);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// }

module.exports = {
  GetPaged
};