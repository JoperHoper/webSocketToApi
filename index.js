const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const server = http.createServer(app);

const io = new Server(server);

let onlineUsers = [];

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

io.on("connection", (socket) => {
  // USER LOGIN
  socket.on("hasLogin", (user) => {
    let userObj = JSON.parse(user);
    console.log(!onlineUsers.find((user) => user === userObj.name));
    if (!onlineUsers.find((user) => user === userObj.name)) {
      onlineUsers.push(userObj.name);
      console.log(onlineUsers);
      socket.emit("getOnlineUsers", JSON.stringify(onlineUsers));
      socket.broadcast.emit("getOnlineUsers", JSON.stringify(onlineUsers));
    }
  });
  // CONNECTION MESSAGES
  io.emit("connection", "a user connected");
  socket.on("disconnect", () => {
    io.emit("connection", "a has disconnected connected");
  });
  // CHAT MESSAGE
  socket.on("chat message", (msg) => {
    io.emit("chat message", msg);
  });
  // USER IS TYPING
  socket.on("typing", (data) => {
    socket.broadcast.emit("userIsTyping", data + " is typing...");
  });
});

server.listen(3000, () => {
  console.log("listening on *:3000");
});
