const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const path = require("path")
const userNamenTime = require("./public/utils/message");
const queryString = require("query-string");

const { togetCurrentUser,getUsertoRoom, getRoomUsers, userleaveschat } = require("./public/utils/user")

app.use(express.static(path.join(__dirname, 'public')));

const USER = "Chat cord"
const USERR = "user"

io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('joinRoom', ({ username, room }) => {

    const usertoRoom = getUsertoRoom(socket.id, username, room);
    socket.join(usertoRoom.room);

    //to show client while entering chat cord
    socket.emit('message', userNamenTime(usertoRoom.username, "Welcome to Chat cord xD"));

    //to show everyone that a user has joined the chat
    socket.broadcast.to(usertoRoom.room).emit('message', userNamenTime(usertoRoom.username, ` ${usertoRoom.username} has joined the chat`));
  
    // to show online users
    io.to(usertoRoom.room).emit('roomUsers', {
      room: usertoRoom.room,
      users : getRoomUsers(usertoRoom.room)
    })
  });

  //listen on chatMessage
    socket.on('chatMessage', (message) => {
      const user = togetCurrentUser(socket.id);
      io.to(user.room).emit('message', userNamenTime(user.username, message));
  })

  //When user disconnect
    socket.on('disconnect', () => {
    const user = userleaveschat(socket.id);

    if(user) {
      io.to(user.room).emit('message', userNamenTime(user.username, ` ${user.username} has left the chat`));
    }
    
    // to show online users
    io.to(user.room).emit('roomUsers', {
      room: user.room,
      users : getRoomUsers(user.room)
    });
  });
})

server.listen(process.env.PORT || 3000, () => {
  console.log('listening on *:3000');
});