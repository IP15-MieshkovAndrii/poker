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

          if(!sockets.isNicknameExist(nickname, room)){
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
            const emitPlayers = pokerTable.emitPlayers();

            const response = JSON.stringify({ type: 'usersInRoom', id: room, emitPlayers});
            ws.clients.forEach(client => client.send(response, { binary: false }));
          }
        } else if (data.type === 'leaveRoom') {
          const { room, nickname } = data;

          sockets.leaveRoom(ws);

          let pokerTable = sockets.getPokerGame(room);
          if(pokerTable) {
            const emitPlayers = pokerTable.emitPlayers();

            const response = JSON.stringify({ type: 'usersInRoom', id: room, emitPlayers});
            ws.clients.forEach(client => client.send(response, { binary: false }));
          }
        } else if (data.type === 'getUsersInRoom') {
          const { room } = data;
          const usersInRoom = sockets.getUsersInRoom(room).users;
          const users = [];
          for (const player of usersInRoom) {
            users.push(player.nickname);
          }
          const pokerTable = sockets.getPokerGame(room);
          const emitPlayers = pokerTable.emitPlayers();

          const response = JSON.stringify({ type: 'usersInRoom', id: room, emitPlayers});
          ws.clients.forEach(client => client.send(response, { binary: false }));
        } else if (data.type === 'startGame') {
          const { room } = data;

          let emitPlayers;
          let users;
          let pokerTable = sockets.getPokerGame(room);;
          let players;
          let dealerIndex;
          let gameEnd = false;
          let response;

          let gameStarted = sockets.isBegun(room);

          if(gameStarted) {
            pokerTable.newGame();
            players = pokerTable.getPlayers();

            dealerIndex = pokerTable.getDealer();

            if (players.length === 1){
              gameEnd = true;
              response = JSON.stringify({ type: 'gameEnd', id: room, winner: players[0].getName()});
            }
          } else {

            console.log("Host has started the game in: " + room);

            for(let currentRoom in sockets.rooms) {
              if(currentRoom === room) {
                sockets.setBegun(currentRoom, true);
                sockets.setPokerGame(currentRoom, pokerTable)
              }
            }
  
            players = pokerTable.getPlayers();
  
            dealerIndex = Math.floor(Math.random() * players.length);
            pokerTable.setDealer(dealerIndex)
          }

          let smallBlind = pokerTable.getSmallBlind();
          let bigBlind = pokerTable.getBigBlind();

          let currentPlayer = pokerTable.nextPlayer(dealerIndex);
          smallBlind = players[currentPlayer].blind(smallBlind);
          pokerTable.changePot(smallBlind)

          currentPlayer = pokerTable.nextPlayer(currentPlayer);
          bigBlind = players[currentPlayer].blind(bigBlind);
          pokerTable.changePot(bigBlind);

          pokerTable.nextPlayer(currentPlayer);

          pokerTable.newHands();

          emitPlayers = pokerTable.emitPlayers();

          users = players.map(player => player.name);

          if (!gameEnd) response = JSON.stringify({ type: 'gameBegun', id: room, users, emitPlayers});
          ws.clients.forEach(client => client.send(response, { binary: false }));
        } else if (data.type === 'playTurn') {
          const {room, choice, currentBet} = data;

          let pokerTable = sockets.getPokerGame(room);
          const players = pokerTable.getPlayers();
          let currentPlayerInd = pokerTable.getCurrentPlayer()
          let currentPlayer = players[currentPlayerInd];
          let leftUntilEnd = pokerTable.getLeftUntilEnd();
          let round = pokerTable.getRound();
          let message;
          let roundEnd = false;
          let bet = 0;
          let name = currentPlayer.name;
          let response = null;

          if (choice === 'FOLD') {
            currentPlayer.fold();
            message = 'Fold';

            const remainingPlayers = players.filter(player => !player.getHasFolded());

            if (remainingPlayers.length === 1) {
              const emitBefore = pokerTable.emitPlayers();

              let winner = remainingPlayers[0].getName();
              const pot = pokerTable.resetPot();
              remainingPlayers[0].win(pot);
              const emitAfter= pokerTable.emitPlayers();
              const emitPlayers = [emitBefore, emitAfter];

              response = JSON.stringify({ type: 'showDown', id: room, bestHands: winner, foldWin: true, emitPlayers});
            }
          } else if (choice === 'CALL') {
            bet = currentBet - currentPlayer.getCurrentBet();
            currentPlayer.call(bet);
            message = 'Call';
            pokerTable.changePot(bet)
          } else if (choice === 'CHECK') {
            message = 'Check';
          } else if (choice === 'RAISE') {
            const {raiseNumber, allIn} = data;
            bet = raiseNumber;
            pokerTable.setLeftUntilEnd(players.length - 1);

            if (allIn) message = 'All-in';
            else message = 'Raise ' + bet;

            currentPlayer.placeBet(+bet);
            pokerTable.changePot(+bet)
          } 

          bet = currentPlayer.getCurrentBet()

          if (leftUntilEnd === 0) {
            pokerTable.setLeftUntilEnd(players.length - 1)
            pokerTable.setRound(round+1);
            roundEnd = true;
          } else {
            pokerTable.oneMoreLeft()
          }

          pokerTable.nextPlayer(currentPlayerInd);
          const emitPlayers = pokerTable.emitPlayers();

          if(response === null) {
            response = JSON.stringify({ type: 'playTurn', id: room, name, emitPlayers, message, roundEnd, bet});
          }

          ws.clients.forEach(client => client.send(response, { binary: false }));
        } else if (data.type === 'newRound') {
          const {room} = data;

          let pokerTable = sockets.getPokerGame(room);
          let round = pokerTable.getRound();
          let communityCards = [];
          let showdown = false;
          let response = '';
          let bestHands = [];
          let players = pokerTable.getPlayers();

          if (round === 2) {
            communityCards = pokerTable.getCommunityCards();
            if(communityCards.length === 0) {
              pokerTable.setCommunityCards(3);
              communityCards = pokerTable.getCommunityCards();
            }
          } else if (round === 3) {
            communityCards = pokerTable.getCommunityCards();
            if(communityCards.length === 3) {
              pokerTable.setCommunityCards(1);
              communityCards = pokerTable.getCommunityCards();
            }
          } else if (round === 4) {
            communityCards = pokerTable.getCommunityCards();
            if(communityCards.length === 4) {
              pokerTable.setCommunityCards(1);
              communityCards = pokerTable.getCommunityCards();
            }
          } else if (round === 5) {
            communityCards = pokerTable.getCommunityCards();
            showdown = true;
            bestHands = pokerTable.evaluateRound();

            let pot = pokerTable.resetPot();
            let amountPerWinner = Math.floor(pot / bestHands.length);
            let remaining = pot % bestHands.length;

            for (let i = 0; i < bestHands.length; i++) {
              const playerName = bestHands[i].name;
              const winningPlayer = players.find(player => player.getName() === playerName);
            
              if (winningPlayer) {
                winningPlayer.win(amountPerWinner);
              }
            }
            pokerTable.changePot(remaining);
          }

          if (!showdown) {
            response = JSON.stringify({ type: 'newRound', id: room, communityCards});
          } else {
            const emitPlayers = pokerTable.emitPlayers();
            response = JSON.stringify({ type: 'showDown', id: room, bestHands, foldWin: false, emitPlayers});
          }

          ws.clients.forEach(client => client.send(response, { binary: false }));
        }
    
      });
      connection.on('close', () => {
        console.log(`Disconnected ${ip}`);
        sockets.leaveRoom(ws);
        let pokerTable = sockets.getPokerGame(ws.room);
        if(pokerTable) {
          const emitPlayers = pokerTable.emitPlayers();

          const response = JSON.stringify({ type: 'usersInRoom', id: ws.room, emitPlayers});
          ws.clients.forEach(client => client.send(response, { binary: false }));
        }
        
      });
    });
  };
  
  module.exports = socketHandler;
  