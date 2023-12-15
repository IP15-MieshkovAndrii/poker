const WebSocket = require('ws');
const Sockets = require('../utils/sockets');
const PokerTable = require('../game/PokerTable')
const PokerPlayer =require('../game/PokerPlayer')

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

          let pokerTable = null;

          if(!sockets.getPokerGame(room)){
            pokerTable = new PokerTable();
            sockets.setPokerGame(room, pokerTable)
          } else {
            pokerTable = sockets.getPokerGame(room);
          }
          let pokerPlayer = new PokerPlayer(nickname, 2000)
          pokerTable.addPlayer(pokerPlayer);
          
          for (const client of ws.clients) {
            if (client.readyState !== WebSocket.OPEN) continue;
            if (client === connection) continue;
            client.send(message, { binary: false });
          }
        } else if (data.type === 'leaveRoom') {
          const { room, nickname } = data;

          sockets.leaveRoom(room, nickname, ws);

          const usersInRoom = sockets.getUsersInRoom(room).users;
          const users = [];
          if(usersInRoom && usersInRoom.length) {
            for (const player of usersInRoom) {
              users.push(player.nickname);
            }
          }

          let pokerTable = sockets.getPokerGame(room);
          if (pokerTable) pokerTable.leaveGame();


          const response = JSON.stringify({ type: 'usersInRoom', users: usersInRoom });
          ws.clients.forEach(client => client.send(response, { binary: false }));

          for (const client of ws.clients) {
            if (client.readyState !== WebSocket.OPEN) continue;
            if (client === connection) continue;
            client.send(message, { binary: false });
          }
        } else if (data.type === 'getUsersInRoom') {
          const { room } = data;
          const usersInRoom = sockets.getUsersInRoom(room).users;
          const users = [];
          for (const player of usersInRoom) {
            users.push(player.nickname);
          }

          const response = JSON.stringify({ type: 'usersInRoom', users, id: room});
          ws.clients.forEach(client => client.send(response, { binary: false }));

          for (const client of ws.clients) {
            if (client.readyState !== WebSocket.OPEN) continue;
            if (client === connection) continue;
            client.send(message, { binary: false });
          }
        } else if (data.type === 'startGame') {
          const { room } = data;
          let pokerTable = sockets.getPokerGame(room);

          console.log("Host has started the game in: " + room);

          for(let currentRoom in sockets.rooms) {
            if(currentRoom === room) {
              sockets.setBegun(currentRoom, true);
              sockets.setPokerGame(currentRoom, pokerTable)
            }
          }

          const players = pokerTable.getPlayers();

          let dealerIndex = Math.floor(Math.random() * players.length);
          pokerTable.setDealer(dealerIndex)

          let smallBlind = pokerTable.getSmallBlind();
          let bigBlind = pokerTable.getBigBlind();

          let currentPlayer = pokerTable.nextPlayer(dealerIndex);
          smallBlind = players[currentPlayer].blind(smallBlind);
          pokerTable.changePot(smallBlind)
          bigBlind = players[pokerTable.nextPlayer(currentPlayer)].blind(bigBlind);
          pokerTable.changePot(bigBlind)

          currentPlayer = pokerTable.nextPlayer(pokerTable.nextPlayer(currentPlayer));

          pokerTable.newHands();

          const emitPlayers = pokerTable.emitPlayers();
          console.log(emitPlayers);

          const users = players.map(player => player.name);
          
          const response = JSON.stringify({ type: 'gameBegun', id: room, users, emitPlayers});
          ws.clients.forEach(client => client.send(response, { binary: false }));
        }

    
      });
      connection.on('close', () => {
        console.log(`Disconnected ${ip}`);
        sockets.leaveRoom(ws);
      });



  
    });
  };
  
  module.exports = socketHandler;
  