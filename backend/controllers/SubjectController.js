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
                { name: { [Op.like]: `%${keyword}%` } }
                ]
            };
        }

        const totalRecords = await db.Subject.count({ where });

        const subjects = await db.Subject.findAll({
            where,
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
            data: subjects
        });

    } catch (err) {
        res.status(500).send(err.message);
    }
}

const CreateSubject = async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) {
            return res.status(400).json({ message: "Vui lòng nhập tên môn học!" });
        }

        const newSubject = await db.Subject.create({ name });
        return res.status(201).json(newSubject);
    } catch (err) {
        res.status(500).send(err.message);
    }
}

const UpdateSubject = async (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body;
        if (!name) {
            return res.status(400).json({ message: "Vui lòng nhập tên môn học!" });
        }

        const CheckSubject = await db.Subject.findOne(
            { where: { id } }
        );

        if (!CheckSubject) {
            return res.status(404).json({ message: "Môn học không tồn tại!" });
        }

        await CheckSubject.update({ name });
        return res.json(CheckSubject);
    } catch (err) {
        res.status(500).send(err.message);
    }
}

const DeleteSubject = async (req, res) => {
    try {
        const { id } = req.params;
        const CheckSubject = await db.Subject.findOne(
            { where: { id } }
        );
        if (!CheckSubject) {
            return res.status(404).json({ message: "Môn học không tồn tại!" });
        }
        await CheckSubject.destroy();
        return res.json({ message: "Môn học đã được xóa!" });
    } catch (err) {
        res.status(500).send(err.message);
    }
}

module.exports = {
    GetPaged,
    CreateSubject,
    UpdateSubject,
    DeleteSubject
}
