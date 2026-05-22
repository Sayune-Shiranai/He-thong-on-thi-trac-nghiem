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
                { grade: { [Op.like]: `%${keyword}%` } }
                ]
            };
        }

        const totalRecords = await db.Grade.count({ where });

        const grades = await db.Grade.findAll({
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
            data: grades
        });

    } catch (err) {
        res.status(500).send(err.message);
    }
}

// Tạo lớp mới
const CreateGrade = async (req, res) => {
    try {
        const { grade } = req.body;
        if (!grade) {
            return res.status(400).json({ message: "Vui lòng nhập lớp!" });
        }

        const newGrade = await db.Grade.create({ grade });
        return res.status(201).json(newGrade);
    } catch (err) {
        res.status(500).send(err.message);
    }
}

// Cập nhật lớp
const UpdateGrade = async (req, res) => {
    try {
        const { id } = req.params;
        const { grade } = req.body;
        if (!grade) {
            return res.status(400).json({ message: "Vui lòng nhập lớp!" });
        }

        const CheckGrade = await db.Grade.findOne(
            { where: { id } }
        );

        if (!CheckGrade) {
            return res.status(404).json({ message: "Lớp không tồn tại!" });
        }

        await CheckGrade.update({ grade });
        return res.json(CheckGrade);
    } catch (err) {
        res.status(500).send(err.message);
    }
}

// Xóa lớp
const DeleteGrade = async (req, res) => {
    try {
        const { id } = req.params;
        const CheckGrade = await db.Grade.findOne(
            { where: { id } }
        );
        if (!CheckGrade) {
            return res.status(404).json({ message: "Lớp không tồn tại!" });
        }
        await CheckGrade.destroy();
        return res.json({ message: "Lớp đã được xóa!" });
    } catch (err) {
        res.status(500).send(err.message);
    }
}

// Lấy tất cả lớp
const GetAllGrades = async (req, res) => {
    try {
        const grades = await db.Grade.findAll({
            order: [["id", "DESC"]]
        });
        return res.json(grades);
    } catch (err) {
        res.status(500).send(err.message);
    }
}

// Lấy tất cả đề thi theo lớp
const GetAllExamsByGrade = async (req, res) => {
    try {
        const { id } = req.params;
        const exams = await db.Exam.findAll({
            where: { 
                grade_id: id 
            },
            order: [["id", "DESC"]]
        });
        return res.json(exams);
    } catch (err) {
        res.status(500).send(err.message);
    }
}

module.exports = {
    GetPaged,
    CreateGrade,
    UpdateGrade,
    DeleteGrade,
    GetAllGrades,
    GetAllExamsByGrade
}
