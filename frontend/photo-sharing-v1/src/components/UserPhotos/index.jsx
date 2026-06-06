import React, { useState, useEffect } from "react";
import { Typography, Card, CardMedia, CardContent, List, ListItem, ListItemText, Divider } from "@mui/material";
import { Link } from "react-router-dom"
import "./styles.css";
import fetchModel from "../../lib/fetchModelData";
import { useParams } from "react-router-dom";
import axios from "axios";

/**
 * Define UserPhotos, a React component of Project 4.
 */
//import dữ liệu mẫu


function UserPhotos() {
  const { userId } = useParams();
  const [photos, setPhotos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newComment, setNewComment] = useState("");
  useEffect(() => {
    setIsLoading(true);
    fetchModel(`https://w98c3h-8080.csb.app/photosOfUser/${userId}`)
      .then((data) => {
        setPhotos(data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.log("Lỗi lấy ảnh: ", err);
        setIsLoading(false);
      })
  }, [userId])
  if (isLoading) {
    return <Typography variant="h6">Đang tải ảnh...</Typography>;
  }
  if (!photos || photos.length === 0) {
    return <Typography variant="h6">Không tìm thấy thông tin ảnh!</Typography>
  }
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('vi-VN', options);
  };
  const handleAddComment = async (photoId) => {
    if (!newComment.trim()) return;
    try {
      await axios.post(`https://w98c3h-8080.csb.app/api/comment/CommentOfPhotos/${photoId}`,
        {
          comment: newComment
        },
        {
          withCredentials: true
        });
      setNewComment("")

      fetchModel(`https://w98c3h-8080.csb.app/photosOfUser/${userId}`)
        .then((data) => setPhotos(data));
    }
    catch (error) {
      alert(error.response?.data?.error || "Lỗi khi upload comment");
    }
  }
  return (
    <div>
      {/* Duyệt qua từng bức ảnh của user */}
      {photos.map((photo) => (
        <Card key={photo._id} style={{ marginBottom: '30px' }}>
          <CardMedia
            component='img'
            image={`https://w98c3h-8080.csb.app/images/${photo.file_name}`}
            alt="User Photo"
          />
          <CardContent>
            <Typography variant="body2" color="textSecondary" gutterBottom>
              Đăng lúc: {formatDate(photo.date_time)}
            </Typography>
            {/*Hiển thị comment */}
            {photo.comments && photo.comments.length > 0 ? (
              <div>
                <Typography variant="subtitle1" style={{ marginTop: '15px', fontWeight: 'bold' }}>Bình luận: </Typography>
                <List>
                  {photo.comments.map((comment) => (
                    <React.Fragment key={comment._id}>
                      <ListItem alignItems="flex-start" style={{ paddingLeft: 0, paddingRight: 0 }}>
                        <ListItemText
                          primary={
                            <Link to={`/users/${comment.user._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                              {comment.user.first_name} {comment.user.last_name}
                            </Link>
                          }
                          secondary={
                            <React.Fragment>
                              <Typography comment="span" variant="caption" color="textSecondary" display="block">
                                {formatDate(comment.date_time)}
                              </Typography>
                              <Typography comment="span" variant="body2" color="textPrimary">
                                {comment.comment}
                              </Typography>
                            </React.Fragment>
                          }
                        />
                      </ListItem>
                      <Divider component="li" />
                    </React.Fragment>
                  ))}
                </List>

              </div>
            ) : (
              <Typography variant="body2" color="textSecondary" style={{ marginTop: '10px' }}>
                Chưa có bình luận nào
              </Typography>
            )}
            {/* ===== CHÈN ĐOẠN CODE BÌNH LUẬN VÀO ĐÂY ===== */}
            <div style={{ marginTop: '15px', display: 'flex', gap: '10px' }}>
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Viết bình luận..."
                style={{ flex: 1, padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
              />
              <button
                onClick={() => handleAddComment(photo._id)}
                style={{ padding: '8px 16px', borderRadius: '4px', border: 'none', backgroundColor: '#1976d2', color: 'white', cursor: 'pointer' }}
              >
                Gửi
              </button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default UserPhotos;
