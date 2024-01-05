// console.log("hello");
const express = require("express");
const path = require("path");
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http);

const PORT = 8000;

const mainfile = path.join(__dirname, "../");
app.use(express.static(mainfile));

app.get("/", function (req, res) {
  res.sendFile(mainfile + "/index.html");
});

const activeusers = {};
let objectLength = 0;
io.on("connection", (socket) => {
  socket.on("new_user_joined", (username) => {
    activeusers[socket.id] = username;
    socket.broadcast.emit("user-joined", username);
    objectLength++;
    io.sockets.emit("user-online", objectLength);

    socket.on("disconnect", () => {
      socket.broadcast.emit("user-left", username);
      objectLength--;
    });
  });

  // send message //
  socket.on("send", (message) => {
    socket.broadcast.emit("recieve", {
      message: message,
      username: activeusers[socket.id],
    });
  });
});

http.listen(PORT, () => {
  console.log(`server running on port: ${PORT}`);
});
