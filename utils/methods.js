const redis_method = require("../redis/functions");

let onlineUsers;

redis_method.getValue("onlineUsers").then((data)=>{
    if (!data){
        console.log("here redis");
        redis_method.setKey("onlineUsers", JSON.stringify([]));
        onlineUsers=[];
    }else{
        onlineUsers = JSON.parse(data);
        console.log(onlineUsers);
    }
    
});


// methods
const addNewUser = (username, socketId) => {
    let beenThere = false;
      onlineUsers.forEach(element => {
          if(element.username==username){
              element.socketId=socketId;
              beenThere=true;
          }
      });
    //   push new obj if username not found in reddis
      if(!beenThere){
      onlineUsers.push({ username, socketId });
      }
    // !onlineUsers.some((user) => user.username === username) &&
    //   onlineUsers.push({ username, socketId });
      redis_method.setKey("onlineUsers", JSON.stringify(onlineUsers));
  };
  
  const removeUser = (socketId) => {
    onlineUsers = onlineUsers.filter((user) => user.socketId !== socketId);
    // console.log(onlineUsers)
    redis_method.setKey("onlineUsers", JSON.stringify(onlineUsers));
  };
  
  const getUser = (username) => {
    return onlineUsers.find((user) => user.username === username);
  };


module.exports={
    addNewUser,
    removeUser,
    getUser
}