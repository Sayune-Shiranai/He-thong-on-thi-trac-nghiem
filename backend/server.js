// sửa file này phải ib
const express = require('express');
// import connectDB from "./db/db.js";
const dotenv = require('dotenv');
// import db from "./models/index.js";
const cors = require('cors');
const path = require('path');
const cookieParser = require('cookie-parser');

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: "http://localhost:5173", // hoặc "http://localhost:5173"
  credentials: true,
}));
app.use(
  "/media",
  express.static(path.join(process.cwd(), "media"))
);

const db = require('./models');

app.get('/HelloWorld', (req, res) => {
  res.send('Hello World!')
})

app.get("/connectDB", async (req, res) => {
  try {
    await db.sequelize.authenticate();
    res.json({ success: true, message: "Kết nối thành công với SQL Server!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Kết nối thất bại", error: err.message });
  }
});

// app.get("/syncDB", async (req, res) => {
//   try {
//     await db.sequelize.sync({ alter: true });
//     res.json({ success: true, message: "Đồng bộ database thành công!" });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ success: false, message: "Đồng bộ database thất bại", error: err.message });
//   }
// });

app.listen(PORT, () => {
  console.log(`Server chạy tại http://localhost:${PORT}`);
});