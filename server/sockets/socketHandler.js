
let sockets = {};


const socketHandler = (socketServer) => {
    socketServer.on("connection", (socket) => {
      console.log(`user ${socket.id} has connected`);
  
      socket.on("joinRoom", ({ room, nickname }) => {
        try {
            // socket.join(room);
            socket.nickname = nickname;
            socket.room = room;
            if (!sockets[room]) {
              sockets[room] = {};
              sockets[room].names = [];
              sockets[room].start = false;
            }
            sockets[room].nicknames = [...sockets[room].nicknames, nickname];
            console.log(`${nickname} joined room ${room}`);
        } catch (error) {
          console.log(error.message);
        }
      });
  
      socket.on("startGame", (room) => {
        try {

        } catch (error) {
          console.log(error.message);
        }
      });
  
      socket.on("endGame", (room) => {
        try {

        } catch (error) {
          console.log(error.message);
        }
      });
    });
  };
  
  module.exports = socketHandler;
  