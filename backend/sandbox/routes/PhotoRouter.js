const express = require("express");
const Photo = require("../db/photoModel");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Đảm bảo thư mục images tồn tại trước khi upload
if (!fs.existsSync('images/')) {
    fs.mkdirSync('images/', { recursive: true });
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'images/');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname))
    }
});
const upload = multer({ storage: storage })

router.post("/new", upload.single('photo'), async (req, res) => {
    if (!req.session.userId) {
        return res.status(401).send({ error: "Bạn cần đăng nhập để xem ảnh" })
    }
    // trả lỗi 400 nếu request ko chứa fule
    if (!req.file) {
        return res.status(400).send({ error: "Không có file nào được tải lên" })
    }
    try {
        const newPhoto = await Photo.create({ file_name: req.file.filename, date_time: new Date(), user_id: req.session.userId, comments: [] })
        res.status(200).send(newPhoto);
    } catch (err) {
        res.status(500).send({ error: "Lỗi server khi lưu ảnh" })
    }
});

router.get("/", async (request, response) => {

});

module.exports = router;
