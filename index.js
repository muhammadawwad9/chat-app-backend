const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const http = require("http");
const socketio = require("socket.io");
const router = require("./router");
const { addUser, removeUser, getUser, getUsersInRoom } = require("./users");
dotenv.config();
const port = process.env.PORT || 4000;
const app = express();
const server = http.createServer(app);
app.use(cors());
app.use(router);
const io = socketio(server, {
  cors: {
    origin: "*",
  },
});
io.on("connection", (socket) => {
  console.log("We have a new connection!!!");
  socket.on("join", ({ userName, room }, callback) => {
    const { error, user } = addUser({ userName, room, id: socket.id });
    if (error) {
      return callback(error);
    }
    //socket.join() joins a user in a room
    socket.join(user.room);
    socket.emit("message", {
      userName: "Admin",
      text: `Welcome ${user.userName} to room ${user.room}`,
    });
    //socket.broadcast sends a message to everyone except that specific user(the owner of that socket)
    socket.broadcast.to(user.room).emit("message", {
      userName: "Admin",
      text: `${user.userName} has joined!`,
    });

    io.to(user.room).emit("roomData", {
      room: user.room,
      users: getUsersInRoom(user.room),
    });
    callback();
  });

  socket.on("sendMessage", (message, callback) => {
    const user = getUser(socket.id);

    io.to(user.room).emit("message", {
      userName: user.userName,
      text: message,
    });
    callback();
  });

  socket.on("disconnect", () => {
    const user = removeUser(socket.id);
    if (user) {
      io.to(user.room).emit("message", {
        userName: "Admin",
        text: `${user.userName} had left`,
      });
      io.to(user.room).emit("roomData", {
        room: user.room,
        users: getUsersInRoom(user.room),
      });
    }
    console.log("User had left!!!");
    socket.destroy();
  });
});

server.listen(port, () => console.log(`Server is running on port ${port}`));
