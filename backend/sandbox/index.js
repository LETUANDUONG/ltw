const express = require("express");
const session = require("express-session")
const app = express();
const cors = require("cors");
const path = require("path");
const dbConnect = require("./db/dbConnect");
const UserRouter = require("./routes/UserRouter");
const PhotoRouter = require("./routes/PhotoRouter");
const User = require("./db/userModel");
const Photo = require("./db/photoModel");
const CommentRouter = require("./routes/CommentRouter");
dbConnect();

app.use(cors({
  origin: ["http://localhost:3000", "https://s772y4.csb.app"],
  credentials: true
}));
app.use(express.json());
app.set("trust proxy", 1);
app.use(session({
  secret: 'chuoimahoa',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    sameSite: 'none',
    secure: true
  }
}
))
app.use("/api/user", UserRouter);
app.use("/api/photo", PhotoRouter);
app.use("/api/comment", CommentRouter);
app.use("/images", express.static(path.join(__dirname, 'images')));

app.get("/", (request, response) => {
  response.send({ message: "Hello from photo-sharing app API!" });
});
app.use(function (req, res, next){
  // Bỏ qua check auth cho các route đăng nhập và đăng ký
  if (req.path === '/admin/login' || req.path === '/admin/logout' || (req.path === '/user' && req.method === 'POST')) {
    return next();
  }
  if(req.session.userId){
    next()
  }
  else{
    return res.status(401).send({error: 'Bạn cần đăng nhập để xem thông tin này'})
  }
})


app.get("/user/list", async function (req, res) {
  try {
    const users = await User.find({}, '_id first_name last_name')
    res.status(200).send(users)
  } catch (err) {
    res.status(500).send({ error: "Lỗi server khi lấy danh sách user" })
  }
})
app.get("/user/:id", async function (req, res) {
  const userId = req.params.id;
  try {
    const user = await User.findById(userId, '_id first_name last_name location description occupation')
    if (!user) {
      return res.status(400).send({ error: "Không tìm thấy thông tin người dùng với ID này" });
    }
    res.status(200).send(user);
  } catch (err) {
    res.status(400).send({ error: "ID người dùng không hợp lệ" })
  }
})
app.get("/photosOfUser/:id", async function (req, res) {
  const userId = req.params.id;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).send({ error: "Không tìm thấy người dùng" });
    }
    const photos = await Photo.find({ user_id: userId })
      .select('_id user_id file_name date_time comments ')
      .populate({
        path: 'comments.user_id',
        select: '_id first_name last_name',
        model: 'Users'
      })
      .lean()
    if (!photos || photos.length === 0) {
      return res.status(200).send([])
    }
    const formattedPhotos = photos.map(photo => {
      const formattedComments = (photo.comments || []).map(comment => {
        return {
          _id: comment._id,
          comment: comment.comment,
          date_time: comment.date_time,
          user: comment.user_id
        }
      })
      return {
        _id: photo._id,
        user_id: photo.user_id,
        file_name: photo.file_name,
        date_time: photo.date_time,
        comments: formattedComments
      }
    })
    res.status(200).send(formattedPhotos)
  } catch (err) {
    console.error(err);
    res.status(400).send({ error: "Lỗi định dạng ID hoặc lỗi lấy dữ liệu ảnh" })
  }
})
app.post('/user', async function(req, res) {
  const {login_name, password, first_name, last_name, location, description, occupation} = req.body;
  if(!login_name || !password || !first_name || !last_name){
    return res.status(400).send({error: 'Thiếu thông tin bắt buộc'})
  }
  try{
    const existingUser = await User.findOne({login_name: login_name})
    if(existingUser){
      return res.status(400).send({error: 'Tên đăng nhập đã tồn tại'})
    }
    const newUser = await User.create({
      login_name, password, first_name, last_name, location, description, occupation
    })
    res.status(200).send({_id: newUser._id, login_name: newUser.login_name})
  }catch(err){
    res.status(400).send({error: 'Lỗi khi tạo tài khoản'})
  }
})
app.post('/admin/login', async function(req, res){
  const {login_name, password} = req.body
  try{
    const user = await User.findOne({login_name: login_name, password: password})
    if(!user){
      return res.status(400).send({error:"Tên đăng nhập hoặc mật khẩu không đúng"})
    }
    req.session.userId = user._id;
    req.session.firstName = user.first_name
    res.status(200).send({
      _id: user._id,
      first_name: user.first_name,
      last_name: user.last_name,
      login_name: user.login_name
    })
  }catch(err){
    res.status(500).send({error: "Lỗi server"})
  }
})
app.post('/admin/logout', function (req, res) {
  if(!req.session.userId){
    return res.status(400).send({error: "người dùng chưa đăng nhập"})
  }
  req.session.destroy(function (err) {
    if(err){
      return res.status(500).send({error: 'Không thể đăng xuất'})
    }
    res.status(200).send({message: 'đăng xuất thành công'})
  })
})

app.listen(8080, () => {
  console.log("server listening on port 8080");
});
