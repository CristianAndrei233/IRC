const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const authRoutes = require("./routes/auth");
const messageRoutes = require("./routes/messages");
const app = express();
const socket = require("socket.io");
require("dotenv").config();

app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("DB Connetion Successfull");
  })
  .catch((err) => {
    console.log(err.message);
  });

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

const server = app.listen(process.env.PORT, () =>
  console.log(`Server started on ${process.env.PORT}`)
);
const io = socket(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET,POST"],
    credentials: true,
  },
});


global.onlineUsers = new Map();
let users = [];
const messages = {
  general: [],
  private: [],
};
io.on("connection", socket => {
  global.chatSocket = socket;
  socket.on("add-user", (userId) => {
    onlineUsers.set(userId, socket.id);
  });

  socket.on('join server', (userId) => {
    const user = onlineUsers(userId, socket.id);
    users.push(user);
    io.emit('new user', user);
  })

  socket.on('join room', (roomName, cb) => {
    socket.join(roomName);
    cb(messages[roomName]);

  })

  socket.on('send message', ({content, to, sender, chatName, isChannel}) => {

    if(isChannel) {
      const payload = { 
        content,
        sender,
        chatName,
      }
      socket.to(to).emit('new message', payload);
    }else{
      const payload = { 
        content,
        chatName: sender,
        sender,
      };
      socket.to(to).emit('new message', payload);
    }
    if(messages[chatName]) {
      messages[chatName].push({
        sender, 
        content,
      });
    }
  });

  socket.on('disconnect', ()=> {
    users = users.filter(u => u.id !== socket.id);
    io.emit('new user', users);
  })


  socket.on("send-msg", (data) => {
    const sendUserSocket = onlineUsers.get(data.to);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("msg-recieve", data.msg);
    }
  });
});
