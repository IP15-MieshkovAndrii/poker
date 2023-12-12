const WebSocket = require('ws');
const Sockets = require('../utils/sockets');

const sockets = new Sockets();

const socketHandler = (ws) => {
    ws.on("connection", (connection, req) => {
      const ip = req.socket.remoteAddress;
      console.log(`Connected ${ip}`);

      connection.on('message', (message) => {
        const data = JSON.parse(message);

        if (data.type === 'joinRoom') {
          const { room, nickname } = data;
          sockets.joinRoom(room, nickname, ws);

          for (const client of ws.clients) {
            if (client.readyState !== WebSocket.OPEN) continue;
            if (client === connection) continue;
            client.send(message, { binary: false });
          }
        } else if (data.type === 'leaveRoom') {
          const { room, nickname } = data;
          sockets.leaveRoom(room, nickname, ws);
          const usersInRoom = sockets.getUsersInRoom(room);
          const response = JSON.stringify({ type: 'usersInRoom', users: usersInRoom });
          ws.clients.forEach(client => client.send(response, { binary: false }));

          for (const client of ws.clients) {
            if (client.readyState !== WebSocket.OPEN) continue;
            if (client === connection) continue;
            client.send(message, { binary: false });
          }
        } else if (data.type === 'getUsersInRoom') {
          const { room } = data;
          const usersInRoom = sockets.getUsersInRoom(room);
          const response = JSON.stringify({ type: 'usersInRoom', users: usersInRoom, id: room});
          ws.clients.forEach(client => client.send(response, { binary: false }));


          for (const client of ws.clients) {
            if (client.readyState !== WebSocket.OPEN) continue;
            if (client === connection) continue;
            client.send(message, { binary: false });
          }
        } else if (data.type === 'startGame') {
          const { room } = data;

          for(let currentRoom in sockets.rooms) {
            if(currentRoom === room) {
              sockets.setBegun(currentRoom, true);
            }
          }
      
          console.log("Host has started the game in: " + room);
          const response = JSON.stringify({ type: 'gameBegun', id: room});
          ws.clients.forEach(client => client.send(response, { binary: false }));
        }

    
      });
      connection.on('close', () => {
        console.log(`Disconnected ${ip}`);
        sockets.leaveRoom(ws);
      });



  
      // socket.on("joinRoom", ({ room, nickname }) => {
      //   try {
      //       // socket.join(room);
      //       socket.nickname = nickname;
      //       socket.room = room;
      //       if (!sockets[room]) {
      //         sockets[room] = {};
      //         sockets[room].names = [];
      //         sockets[room].start = false;
      //       }
      //       sockets[room].nicknames = [...sockets[room].nicknames, nickname];
      //       console.log(`${nickname} joined room ${room}`);
      //   } catch (error) {
      //     console.log(error.message);
      //   }
      // });
  
      // socket.on("startGame", (room) => {
      //   try {

      //   } catch (error) {
      //     console.log(error.message);
      //   }
      // });
  
      // socket.on("endGame", (room) => {
      //   try {

      //   } catch (error) {
      //     console.log(error.message);
      //   }
      // });
    });
  };
  
  module.exports = socketHandler;
  