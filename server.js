import { count } from "console";
import express from "express";
import http from "http";
import socket from "socket.io";
import queryString from "query-string";

const app = express();
const PORT = 5000;
const server = http.Server(app);
const io = socket(server);
let counter = 0;

app.use("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

io.on("connection", (socket) => {
  let name = "user" + counter++;

  io.to(socket.id).emit("change name", name);

  socket.on("disconnect", () => {
    console.log("사용자 연결이 끊어졌습니다.");
  });

  socket.on("send message", (name, text) => {
    const message = name + " : " + text;
    io.emit("receive message", message);
  });
});

server.listen(PORT, () => {
  console.log("서버가 연결되었습니다.");
});
