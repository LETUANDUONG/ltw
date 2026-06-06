import React, {useState, useEffect} from "react";
import {Typography, Button, Divider} from "@mui/material";
import {Link} from "react-router-dom";
import fetchModel from "../../lib/fetchModelData";
import "./styles.css";
import {useParams} from "react-router-dom";

/**
 * Define UserDetail, a React component of Project 4.
 */
// import dữ liệu mẫu


function UserDetail() {
    const { userId } = useParams();
    const [user, setUser] = useState(null);
    useEffect(() => {
      fetchModel(`https://w98c3h-8080.csb.app/user/${userId}`)
      .then((data) => {
        setUser(data)
      })
      .catch((err) => {
        console.error("Lỗi lấy chi tiết user:", err);
      })
    }, [userId])
    if(!user){
      return <Typography variant="h6">Không tìm thấy thông tin người dùng!</Typography>
    }
    return (
      <div className="user-detail-container">
        <Typography variant="h6" gutterBottom>
          {user.first_name} {user.last_name}
        </Typography>
        <Divider style={{marginBottom: '16px'}}/>
        <Typography variant="body1" gutterBottom>
          <strong>Location:</strong> {user.location}
        </Typography>
        <Typography variant="body1" gutterBottom>
          <strong>Description:</strong> {user.description}
        </Typography>
        <Typography variant="body1" gutterBottom>
          <strong>Occupation:</strong> {user.occupation}
        </Typography>
        {/* Nút chuyển sang UserPhotos để xem ảnh */}
        <Button 
          variant="contained"
          color="primary"
          component={Link}
          to={`/photos/${user._id}`}
          style={{marginTop: '20px'}}
          >
            Xem ảnh của {user.first_name}
          </Button>
      </div>
    );
}

export default UserDetail;
