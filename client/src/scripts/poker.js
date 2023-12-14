// poker.js
// const socket = new WebSocket('ws://127.0.0.1:8000/game');


export const startGame = (id, users) => {

    sessionStorage.setItem('game', JSON.stringify({ room: id, gameStarted: true }));
    sessionStorage.setItem('usersInRoom', JSON.stringify({ room: id, users}));

}
  


  