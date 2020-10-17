let currentMessagesId=1;

const createMessage = (user, messageText) => {
    return {
      _id: currentMessagesId++,
      text: messageText,
      createdAt: new Date(),
      user: {
        _id: user.userId,
        name: user.username,
        avatar: user.avatar,
      },
    };
};

const handleMessage = (socket,users) =>{
    socket.on("message", (msg) => {
        const user=users[socket.id]
        const message =createMessage(user,msg)
        socket.broadcast.emit("message", message);
      });
}

module.exports={handleMessage}