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

          const pokerTable = null;

          if(!sockets.getPokerGame(room)){
            pokerTable = new PokerTable();
            sockets.setPokerGame(room, pokerTable)
          } else {
            pokerTable = sockets.getPokerGame(room);
          }
          const pokerPlayer = new PokerPlayer(nickname, 2000)
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
          for (const player of usersInRoom) {
            users.push(player.nickname);
          }

          const pokerTable = sockets.getPokerGame(room);
          pokerTable.leaveGame()

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
          const pokerTable = sockets.getPokerGame(room);

          console.log("Host has started the game in: " + room);

          for(let currentRoom in sockets.rooms) {
            if(currentRoom === room) {
              sockets.setBegun(currentRoom, true);
              sockets.setPokerGame(currentRoom, pokerTable)
            }
          }

          const players = pokerTable.getPlayers();

          const dealerIndex = Math.floor(Math.random() * players.length);
          pokerTable.setDealer(dealerIndex)

          const smallBlind = pokerTable.getSmallBlind();
          const bigBlind = pokerTable.getBigBlind();

          let currentPlayer = pokerTable.nextPlayer(dealerIndex);
          smallBlind = players[currentPlayer].blind(smallBlind);
          bigBlind = players[pokerTable.nextPlayer(currentPlayer)].blind(bigBlind);

          currentPlayer = pokerTable.nextPlayer(currentPlayer);

          pokerTable.newHands();

          const emitPlayers = pokerTable.emitPlayers()
          
          const response = JSON.stringify({ type: 'gameBegun', id: room, users: players, dealer});
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
  