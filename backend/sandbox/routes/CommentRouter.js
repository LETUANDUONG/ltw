const express = require("express");
const Photo = require("../db/photoModel");
const router = express.Router();

router.post("/CommentOfPhotos/:photo_id", async (req, res) =>{
    if(!req.session.userId){
            return res.status(401).send({error: "Bạn cần đăng nhập để bình luận"})
        }
    // Lấy nội dung từ body để kiểm tra
    const {comment} = req.body;
    if(!comment || comment.trim() === ""){
        res.status(400).send({error: "Bình luận không được để trống"});
    }
    try{
        const photoId = req.params.photo_id;
        // Tìm photo bằng photoId
        const photo = await Photo.findById(photoId)
        if(!photo){
            return res.status(400).send({error: "Không tìm thấy ảnh"})
        }
        // khởi tạo object comment mới
        const newComment = {
            comment: comment,
            date_time: new Date(),
            user_id: req.session.userId
        }
        // thêm comment vào array của document Photo và lưu lại
        photo.comments.push(newComment)
        await photo.save()
        res.status(200).send(photo);
    }catch(err){
        res.status(400).send({message: "Loi ket noi server"})
    }
})

module.exports = router;