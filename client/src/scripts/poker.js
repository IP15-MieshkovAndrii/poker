// poker.js
// const socket = new WebSocket('ws://127.0.0.1:8000/game');


export const startGame = (id, users) => {

    // const randomDealerIndex = Math.floor(Math.random() * users.length);



    localStorage.setItem('game', JSON.stringify({room: id, users, gameStarted: true}));



}
  


  