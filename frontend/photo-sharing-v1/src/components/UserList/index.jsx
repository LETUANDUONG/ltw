import React, {useState, useEffect} from "react"
import {Link} from "react-router-dom";
import {
  Divider,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";

import "./styles.css";
import fetchModel from "../../lib/fetchModelData";

/**
 * Define UserList, a React component of Project 4.
 */
function UserList () {
    const [users, setUsers] = useState([])
    useEffect(() => {
      fetchModel('http://localhost:8081/user/list')
      .then((data) => {
        setUsers(data)
      })
      .catch((err) => {
        console.error("Không thể lấy danh sách User: ", err);
      })
    }, [])
    return (
      <div>
        <Typography variant="body1">
          Danh sách người dùng
        </Typography>
        <List component="nav">
          {users.map((user) => (
            <React.Fragment key = {user._id}>
              {/* Sử dụng Link từ react router để tránh reload trang */}
              <ListItem button component={Link} to={`/users/${user._id}`}>
                      <ListItemText primary={`${user.first_name} ${user.last_name}`}/>
              </ListItem>
              <Divider />
            </React.Fragment>
          ))}
        </List>
      </div>
    );
}

export default UserList;
