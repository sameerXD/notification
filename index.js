const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const event_functions = require("./utils/methods");
const request = require("request");

// redis_method.setKey("temp", "sameer");
// redis_method.getValue("temp").then((data)=>{
//     console.log(data);
// });

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});


let onlineUsers = [];


// methods
// const addNewUser = (username, socketId) => {
//     !onlineUsers.some((user) => user.username === username) &&
//       onlineUsers.push({ username, socketId });
//   };
  
//   const removeUser = (socketId) => {
//     onlineUsers = onlineUsers.filter((user) => user.socketId !== socketId);
//   };
  
//   const getUser = (username) => {
//     return onlineUsers.find((user) => user.username === username);
//   };
  
io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('disconnect', () => {
    event_functions.removeUser();
    console.log('user disconnected');
  });

  socket.on('chat message', (message)=>{
      console.log("message "+ message);
  });

  socket.on('set name', ({name, socket_id})=>{
    // console.log("name "+ name);
    // console.log("socket_id "+ socket_id);
    event_functions.addNewUser(name, socket_id);
    console.log(onlineUsers)
    var options = {
        url: "http://34.214.207.222:80/api/users/search_student_by_name?name="+name,
        headers: {
          'access-token': 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoyLCJlbWFpbCI6InNhbWVlcnZhc2hpc2h0MzlAZ21haWwuY29tIiwiZXhwIjoxNjU0Njc4Mjg3fQ.WF2XWNgXvHldyudBzMz6-81NzxCxWAjeWMchrY0KUO8'
        },
      
      };

    request.get(options, function(err, response, body) {
        if (!err && response.statusCode == 200) {
            var locals = JSON.parse(body);
            console.log(locals);
            socket.emit("set_user", locals);
        }
    })

});

 socket.on("send_notification",(data)=>{
     console.log(data);
     let send_to_user=event_functions.getUser(data.send_to);
    console.log("send to ", send_to_user);
    // if user exist in redis
    if(send_to_user){
        // console.log("here senf to user "+ send_to_user.socketId);
        socket.to(send_to_user.socketId).emit("getnotified",data.notification);
    }
 })
});

server.listen(3000, () => {
  console.log('listening on *:3000');
});