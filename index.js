const express = require("express");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io").listen(server);
const port = 8080;
const { v1:uuidv1 } = require('uuid')
const messageHanlder = require('./handlers/message.handlers')
//let currentUserId = 2;r
const users = {};

const createUserAvatar = () =>{
  const rand1 = Math.round(Math.random() * 200 + 100);
  const rand2 = Math.round(Math.random() * 200 + 100);
  return `https://placeimg.com/${rand1}/${rand2}/any`
}

const createuserOnline = () =>{
      const values= Object.values(users)
      const onlyWithUsername =values.filter(u=>u.username != undefined)
      return onlyWithUsername
}

io.on("connection", (socket) => {
  users[socket.id] = {userId: uuidv1()}
  socket.on("join",username =>{
    users[socket.id].username=username;
    users[socket.id].avatar =createUserAvatar()
    messageHanlder.handleMessage(socket,users)
  })
  socket.on("disconnect",()=>{
    delete users[socket.id]
    io.emit("action",{
                 type:"users_online",
                 data:createuserOnline()
    })
  })
  socket.on("action",action =>{
     switch (action.type) {
       case "server/hello":
          socket.emit("action",{type:"message",data:"GOOD DAY"})
         break;
       case "server/join":
          users[socket.id].username=action.username;
          users[socket.id].avatar =createUserAvatar()
          console.log('server',users)
          io.emit("action",
              {
                 type:"users_online",
                 data:createuserOnline()
              })
       default:
         break;
     }
  })
});

server.listen(port, () => console.log("server running on port:" + port));
