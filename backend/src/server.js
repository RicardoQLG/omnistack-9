const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const socketio = require("socket.io");
const http = require("http");

const routes = require("./routes");

const app = express();
const server = http.Server(app);
const io = socketio(server);

const connected_user = {};

mongoose.connect("mongodb+srv://OmniStack:rzVGHJYuPvmyChEj@geral-ndeletar-jxlgi.mongodb.net/aircnc?retryWrites=true&w=majority", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

io.on('connection', socket => {
  const { user_id } = socket.handshake.query;

  connected_user[user_id] = socket.id;
  console.log(`Client connected ${user_id}`);
});

app.use((req, res, next) => {
  req.io = io;
  req.connected_user = connected_user;


  return next();
});

app.use(cors());
app.use(express.json());
app.use('/files', express.static(path.resolve(__dirname, "..", "uploads")));
app.use(routes);

server.listen(3333);