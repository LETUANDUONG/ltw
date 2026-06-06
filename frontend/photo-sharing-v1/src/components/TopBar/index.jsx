import React, {useState, useEffect} from "react";
import {Grid, AppBar, Toolbar, Typography, Button} from "@mui/material";
import { useLocation } from "react-router-dom";
import fetchModel from "../../lib/fetchModelData";
import "./styles.css";
import axios from "axios"

/**
 * Define TopBar, a React component of Project 4.
 */
function TopBar ({ loggedInUser, setLoggedInUser }) {
  const [user, setUser] = useState([]);
  const location = useLocation();
  const pathArray = location.pathname.split('/');
  const context = pathArray[1];
  const userId = pathArray[2];
  let rightContent = '';
  useEffect(() => {
    fetchModel(`https://w98c3h-8080.csb.app/user/${userId}`)
    .then((data) => {
      setUser(data)
    })
    .catch((err) => {
      console.error("Lỗi lấy thông tin user: ", err)
    })
  }, [userId])
    if(user){
      if(context === "users")
        rightContent = `${user.first_name} ${user.last_name}`;
      else if(context === "photos")
        rightContent = `Photos of ${user.first_name} ${user.last_name}`;
    }
    const handleLogout = async() =>{
      try{
        const response = await fetch('https://w98c3h-8080.csb.app/admin/logout', {
          method: 'POST',
          credentials: 'include'
        })
        if(response.ok)
        {
          setLoggedInUser(null)
        }
      }catch(err){
        console.error("Lỗi đăng xuất", err)
      }
    }
    const handlePhotoUpload = async(e) => {
      const file = e.target.files[0];
      if(!file) return;
      // phải bọc file vào FormData trước khi gửi request file lên express server
      const formData = new FormData();
      formData.append('photo', file);
      try{
        await axios.post('https://w98c3h-8080.csb.app/api/photo/new', formData, {
          headers: {'Content-Type': 'multipart/form-data'}, 
          withCredentials: true
        });
        alert("Upload ảnh thành công !");
      }catch(error){
        alert(error.response?.data?.error || "Lỗi khi upload ảnh");
      } finally {
        // Reset lại giá trị của input để có thể chọn lại cùng một file nếu muốn
        e.target.value = null;
      }
    }
    return (
      <AppBar className="topbar-appBar" position="absolute">
        <Toolbar>
          <Grid container justifyContent="space-between" alignItems="center">
            <Grid item>
              {/*Góc trái */}
              <Typography variant="h5" color="inherit">
                Lê Tuấn Dương
              </Typography>
              {loggedInUser ? (
                <Typography variant="body1" color='inherit'>
                  Hi {loggedInUser.first_name}
                </Typography>
              ): (
                <Typography variant="body1" color='inherit'>
                  Please login
                </Typography>
              )}
            </Grid>
            <Grid item style={{display: 'flex', alignItems: 'center', gap: '20px'}}>
              <Typography variant="h5" color="inherit">
                {rightContent}
              </Typography>
              {loggedInUser && (
                <Button color="secondary" variant="contained" onClick={handleLogout}>
                  Logout
                </Button>
              )}
            </Grid>
          </Grid>
          <div className = "toolbar - actions">
            <input type="file" accept="image/*" onChange={handlePhotoUpload} style={{display: 'none'}} id="upload-photo" />
            <label htmlFor="upload-photo" className="button-add-photo">
              Add Photo
            </label>
          </div>
        </Toolbar>
      </AppBar>
    );
}

export default TopBar;
