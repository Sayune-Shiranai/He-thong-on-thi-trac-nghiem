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

module.exports = {
  GetPaged
};