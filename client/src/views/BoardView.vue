<template>
    <div class="board">
      <div class="startButtom" v-if="isHost && !gameStarted">
        <button @click="startGame">START</button>
      </div>
      <div class="table">
        <div class="communityCards">
          <img class='comCard' src="/img/back.png">
          <img class='comCard' src="/img/back.png">
          <img class='comCard' src="/img/back.png">
          <img class='comCard' src="/img/back.png">
          <img class='comCard' src="/img/back.png">
        </div>
        <div class="pot" v-if="gameStarted">
          POT SIZE: {{ potSize }}
        </div>
        <div class="myCards">
          <img v-if="!myInfo.isFold" class="card1 leftTilt" :src="getCardImage(myInfo.card1, true)">
          <img v-if="!myInfo.isFold" class="card2 rightTilt" :src="getCardImage(myInfo.card2, true)">
          <div v-if="myInfo.isFold" class="fold">FOLD</div>
          <div class="myPlayer"  :class="{ 'currentPlayer': playerName === currentPlayer }">
            <img class="myDealerChip" :class="{ 'dealer-active': playerName === dealer }" src="/img/DEALER-CHIP.png">
            <p>
              <span class="myName">You</span><br>
              <span class="myStack">{{chips}}</span>
              <div v-for="(name, index) in tooltipName" class="tooltip" :class="{'visible': playerName === name}">
                <span v-html="tooltipText[index].replace(/\r\n/g, '<br>')"></span>
              </div>
            </p>
          </div>

        </div>
        <div class="players">
          <div v-for="user in users" :key="user.name" class="player">
            <img v-if="!user.isFold" class="opponentCards leftTilt" :src="getCardImage(user.card1)">
            <img v-if="!user.isFold" class="opponentCards rightTilt" :src="getCardImage(user.card2)">
            <div v-if="user.isFold" class="fold">FOLD</div>
            <div class="otherPlayerInfo" :class="{ 'currentPlayer': user.name === currentPlayer}">
              <img class="myDealerChip" :class="{ 'dealer-active': user.name === dealer }" src="/img/DEALER-CHIP.png">
              <p>
                <span class="opponentPlayerName">{{ user.name }}</span><br>
                <span class="opponentStackSize">{{+user.chips || 2000}}</span>
                <div v-for="(name, index) in tooltipName" class="tooltip" :class="{'visible': user.name === name}">
                  <span v-html="tooltipText[index].replace(/\r\n/g, '<br>')"></span>
                </div>
              </p>
            </div>
          </div>
        </div>
      </div>
      <div class="userPanel">
        <button :disabled="(myInfo.isTurn !== true) || (playerName !== currentPlayer)" @click="myTurn('FOLD')">FOLD</button>
        <button :disabled="(myInfo.isTurn !== true) || (playerName !== currentPlayer) || (myInfo.moneyIn < currentBet) && (chips !== 0)" @click="myTurn('CHECK')">CHECK</button>
        <button :disabled="(myInfo.isTurn !== true) || (playerName !== currentPlayer) || (myInfo.moneyIn >= currentBet) || (chips === 0)" @click="myTurn('CALL')">CALL</button>
        <button :disabled="(myInfo.isTurn !== true) || (playerName !== currentPlayer)" @click="doRaise">RAISE</button>
        <button class="red" @click="leaveRoom">LEAVE</button>
      </div>
      <div class="raiseContainer">
        <input v-model="raiseValue" type="range" orient="vertical" min="0" :max="chips" value="2" class="slider" id="myRange">
        <span v-text="total" class="raise-value"></span>
      </div>
      <div class="svg-container" @click="toggleTokenVisibility">
        <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="30" height="30" viewBox="0,0,256,256">
          <g fill="#7ab3f8" fill-rule="nonzero" stroke="none" stroke-width="1" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0" font-family="none" font-weight="none" font-size="none" text-anchor="none" style="mix-blend-mode: normal"><g transform="scale(5.12,5.12)"><path d="M40,0c-5.46484,0 -9.92187,4.39844 -10,9.84375c0,0.05078 0,0.10547 0,0.15625c0,3.6875 1.99609,6.89063 4.96875,8.625c1.47656,0.86328 3.19922,1.375 5.03125,1.375c5.51563,0 10,-4.48437 10,-10c0,-5.51562 -4.48437,-10 -10,-10zM28.0625,10.84375l-10.21875,5.125c2.37891,2.0625 3.94141,5.03125 4.125,8.375l10.34375,-5.1875c-2.41406,-2.02734 -4.01172,-4.98047 -4.25,-8.3125zM10,15c-5.51562,0 -10,4.48438 -10,10c0,5.51563 4.48438,10 10,10c2.05078,0 3.94141,-0.625 5.53125,-1.6875c2.68359,-1.79297 4.46875,-4.83984 4.46875,-8.3125c0,-3.58984 -1.91016,-6.73437 -4.75,-8.5c-1.53125,-0.95312 -3.32031,-1.5 -5.25,-1.5zM21.96875,25.65625c-0.18359,3.33984 -1.71875,6.33984 -4.09375,8.40625l10.1875,5.09375c0.23828,-3.33203 1.80859,-6.28125 4.21875,-8.3125zM40,30c-2.0625,0 -3.96875,0.64453 -5.5625,1.71875c-2.66797,1.79688 -4.4375,4.82422 -4.4375,8.28125c0,0.01563 0,0.01563 0,0.03125c-0.04297,0.00391 -0.08203,0.02734 -0.125,0.03125l0.125,0.0625c0.06641,5.45703 4.52734,9.875 10,9.875c5.51563,0 10,-4.48437 10,-10c0,-5.51562 -4.48437,-10 -10,-10z"></path></g></g>
        </svg>
      </div>
      <div class="token" v-if="isIDVisible">
        <span>Share room id: {{ id }}</span>
      </div>
    </div>
</template>
  
  <script>
  import * as api from '../apiClient';
  import * as poker from '../scripts/poker';

  export default {
    name: 'BoardView',
    data() {
        return {
          id: this.$route.params.id || '',
          isIDVisible: false,
          playerName: sessionStorage.getItem('nickname') || 'Name',
          socket: new WebSocket('ws://127.0.0.1:3000/game'),
          otherPlayers: [],
          hostName: this.getHost() || '',
          gameStarted: JSON.parse(sessionStorage.getItem('game'))?.gameStarted || false,
          isHost: false,
          allUsers: [],
          dealer: '',
          myInfo: '',
          chips: 2000,
          tooltipName: [],
          tooltipText: [],
          potSize: 0,
          currentPlayer: '',
          currentBet: 0,
          maxRaise: Math.min(150, this.chips),
          communityCards: [],
          showdown: false,
          raiseValue: 0,
        };
    },
    methods: {
      toggleTokenVisibility() {
        this.isIDVisible = !this.isIDVisible;
      },
      handleSocketOpen() {
        console.log('Connected');
        this.socket.send(JSON.stringify({ type: 'joinRoom', room: this.id, nickname: this.playerName }));
      },
      leaveRoom() {
        const leaveRoomMessage = JSON.stringify({ type: 'leaveRoom', room: this.id, nickname: this.playerName });
        this.socket.send(leaveRoomMessage);
        this.socket.close();
        this.$router.push('/');
        sessionStorage.clear();
      },

      handleSocketMessage(event) {
        const data = JSON.parse(event.data);
        if(this.id === data.id){
          if (data.type === 'usersInRoom') {
            this.allUsers = data.emitPlayers.slice(2);
            console.log('emit',data.emitPlayers.slice(2))
            console.log('allusers',this.allUsers);
          } else if (data.type === 'gameBegun') {
            this.cardsOnTable([]);
            this.gameStarted = true;
            this.showdown = false;
            this.noCards();
            const dealerIndex = data.emitPlayers[0];
            setTimeout(() => {
              this.dealer = data.users[dealerIndex];

              console.log('Dealer assigned:', this.dealer);
              const str = 'Dealer assigned:' + this.dealer;

              this.sliceToolTip(1);
              this.setToolTip(str, this.dealer)

            }, 1000);
            const array = data.emitPlayers.slice(2);

            const smallBlindTimeout = 1000 + 2200;
            const bigBlindTimeout = smallBlindTimeout + 2200;

            this.smallBigBlind(array, dealerIndex, smallBlindTimeout, bigBlindTimeout);

            poker.startGame(this.id, data.users);
          } else if (data.type === 'playTurn') {
            const emitPlayers = data.emitPlayers
            this.allUsers = emitPlayers.slice(2);
            this.potSize = data.emitPlayers[1];
            this.currentBet = data.bet;
            this.sliceToolTip(1);
            this.setToolTip(data.message, data.name);


            setTimeout(() => {
              if(this.tooltipName[0] === data.name) this.sliceToolTip(1);
            }, 2200);

            if (data.roundEnd) {
              if (this.currentPlayer === this.playerName) {
                this.socket.send(JSON.stringify({ type: 'newRound', room: this.id }));
              }

            } else {
              this.currentPlayer = this.allUsers.find(user => user.isTurn === true).name;
            }
            
          } else if (data.type === 'newRound') {
            this.currentPlayer = this.allUsers.find(user => user.isTurn === true).name;
            this.cardsOnTable(data.communityCards);
          } else if (data.type === 'showDown') {
            if(data.foldWin === true) {
              const emitPlayers = data.emitPlayers;
              const before = emitPlayers[0];
              const after = emitPlayers[1]
              this.allUsers = before.slice(2);

              setTimeout(() => {
                this.sliceToolTip(1);
                this.setToolTip('WIN', data.bestHands);

                setTimeout(() => {
                  this.currentPlayer = '';
                  this.showdown = true;
                  this.potSize = after[1];
                  this.allUsers = after.slice(2);
                }, 1000)
              }, 1000);
            } else {
              setTimeout(() => {
                this.currentPlayer = '';
                this.showdown = true;
                this.results(data.bestHands);

                const emitPlayers = data.emitPlayers;
                this.potSize = emitPlayers[1];
                this.allUsers = emitPlayers.slice(2);
              }, 2000);
            }

            if(this.isHost) {
              setTimeout(() => {

                this.socket.send(JSON.stringify({ type: 'startGame', room: this.id }));
              }, 6000)
            }


          } else if (data.type === 'gameEnd') {
            setTimeout(() => {
              this.sliceToolTip(1);
              this.setToolTip('WINNER', data.winner);
              }, 2000);
          }
        }
      },

      smallBigBlind(array, dealerIndex, sT, bT) {
        let updatedArray = array.map(user => ({
          ...user,
          chips: user.chips + user.moneyIn
        }));
        this.allUsers = updatedArray;

        setTimeout(() => {
          updatedArray = updatedArray.map(user => ({
            ...user,
            chips: user.chips - (user.moneyIn === 1 ? user.moneyIn : 0)
          }));
          let currentName = this.allUsers[(dealerIndex+1)%this.allUsers.length].name;
          if(this.playerName === currentName)
          this.allUsers = updatedArray;
          console.log('Small blind:', currentName);

          this.currentPlayer = currentName;

          const str = 'Small blind: 1 chip';
          this.sliceToolTip(1);
          this.setToolTip(str, currentName);

          this.potSize += 1;

          this.currentBet = 1;
        }, sT);

        setTimeout(() => {
          this.allUsers = array;
          let currentName = this.allUsers[(dealerIndex+2)%this.allUsers.length].name;
          console.log('Big blind:', currentName);

          this.currentPlayer = currentName;

          const str = 'Big blind: 2 chips';
          this.sliceToolTip(1);
          this.setToolTip(str, currentName);
          this.potSize += 2;
          this.currentBet = 2;

        }, bT);

        setTimeout(() => {
          this.sliceToolTip(1);

          this.currentPlayer = '';

          this.giveCards();
        }, bT+2000);

        setTimeout(() => {


          const userWithTurn = this.allUsers.find(user => user.isTurn === true);
          this.currentPlayer = userWithTurn.name;

          this.giveCards();
        }, bT+4000);

      },

      setToolTip(str, name) {
        this.tooltipName.push(name)
        this.tooltipText.push(str);
      },
      sliceToolTip(i) {
        this.tooltipName = this.tooltipName.slice(i);
        this.tooltipText = this.tooltipText.slice(i);
      },

      giveCards() {
        const card1Element = document.querySelector('.card1');
        const card2Element = document.querySelector('.card2');
        const opponentCardsElements = document.querySelectorAll('.opponentCards');

        if (card1Element && card2Element) {
            card1Element.classList.add('card-display');
            card2Element.classList.add('card-display');
        }

        if (opponentCardsElements) {
          opponentCardsElements.forEach(element => {
              element.classList.add('card-display');
          });
        }
      },

      noCards() {
        const card1Element = document.querySelector('.card1');
        const card2Element = document.querySelector('.card2');
        const opponentCardsElements = document.querySelectorAll('.opponentCards');

        if (card1Element && card2Element) {
            card1Element.classList.remove('card-display');
            card2Element.classList.remove('card-display');
        }

        if (opponentCardsElements) {
          opponentCardsElements.forEach(element => {
              element.classList.remove('card-display');
          });
        }
      },


      myTurn(choice) {
        this.socket.send(JSON.stringify({ type: 'playTurn', room: this.id, choice, currentBet: this.currentBet }));
      },

      doRaise() {
        let raiseNumber = this.raiseValue;
        let allIn = false;
        if (raiseNumber === this.chips) {
          allIn = true;
        }
        const choice = 'RAISE';

        this.raiseValue = 0;
        
        this.socket.send(JSON.stringify({ type: 'playTurn', room: this.id, choice, currentBet: this.currentBet, raiseNumber, allIn }));
      },
      
      async getHost() {
        try {
          if(!this.id){this.id = this.$route.params.id}
          const response = await api.getHost({
            id: this.id,
          });
          if(response.status === 200){
            if(this.playerName === response.data.hostname) this.isHost = true;
            return response.data.hostname;

          }
          return ''

        } catch (error) {
          console.error('Error creating room:', error);
        }
      },

      startGame() {
        console.log('Players', this.allUsers);
        if(this.allUsers && this.allUsers.length > 1) {
          this.socket.send(JSON.stringify({ type: 'startGame', room: this.id }));
        }

      },

      cardsOnTable(cards) {
        this.communityCards = cards;
        const tableCards = document.querySelectorAll('.comCard');

        if (tableCards) {
          for (let i = 0; i < tableCards.length; i++) {
            const element = tableCards[i];
            if (i < this.communityCards.length) {
              element.classList.add('card-visible');
              element.src = "/img/" + this.communityCards[i];
            } else {
              element.classList.remove('card-visible');
            }
          }
        }

      },

      getCardImage(card, myCart = false) {
        const basePath = '/img/';
        if(card){

          if(this.showdown || myCart) return `${basePath}${card}`;

          return `${basePath}back.png`
        }
        return `${basePath}back.png`
      },

      results(hands) {
        for (let i = 0; i < hands.length; i++) {
          const hand = hands[i];
          this.setToolTip(hand.message, hand.name);
        }
      }

    },

    created() {
      this.socket.addEventListener('open', () => {
        this.handleSocketOpen();
      } );
      this.socket.addEventListener('close', () => {
        console.log('Closed');

      });
      this.socket.addEventListener('message', (event) => {
        this.handleSocketMessage(event);
      });
    },

    computed: {
      users() {
        if(this.allUsers.length === 0) {
          return [];
        }
        const myIndex = this.allUsers.findIndex(user => user.name === this.playerName);

        if (myIndex !== -1) {
          const clockwiseOrder = [
              ...this.allUsers.slice(myIndex),
              ...this.allUsers.slice(0, myIndex)
          ];

          console.log('Clockwiser', clockwiseOrder)

          if(clockwiseOrder)this.allUsers = clockwiseOrder;
          
          this.myInfo = this.allUsers[0];
          this.chips = this.myInfo.chips;
          document.querySelector('.slider').max = this.chips;
        }

        return this.allUsers.slice(1);
      },

      total() {

        return this.raiseValue !== this.chips ? this.raiseValue : 'ALL-IN';
      }
    },
  };
  </script>
  
  <style scoped>
  .board {
    padding: 1.5em;
    height:calc(100vh - 3em);
    width:calc(100vw - 3em);
    background-color: #9a0c0c;
    display: flex;
    justify-content: center;
    /* align-items: center; */
  }
  .table {
    height: 50vh;
    width:70vw;
    background-color: #053e05;
    border: 10px solid #fff;
    border-radius: 70px;
    margin-top: 8em;
  }

  .pot {
    position: absolute;
    color: #fff;
    margin-top:1em;
    font-size: 2vw;
    font-weight: 600;
    top: 50%;
    left: 42%;
  }
  .userPanel{
    position: fixed;
    bottom: 7vh;
    right: -2vw;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
    gap: 2em;
  }

  .userPanel button {
    background-color: #998e1c;
    border: 2px solid black;
    width: 7vw;
    height: 5vh;
    cursor: pointer;
    flex: 1 0 30%;
    max-width: calc(30% - 2em);
  }
  .userPanel button:hover, .userPanel button:active {
    background-color: #cdbb31;
  }

  .userPanel button:disabled {
    cursor:not-allowed;
    pointer-events: none;
    opacity: 0.6;
  }

  .userPanel button:hover:disabled,
  .userPanel button:active:disabled {
    background-color: inherit;
    color: inherit;
    border-color: inherit;
    box-shadow: none;
  }

  .svg-container {
    position: relative;
    cursor: pointer;
    height: 30px;
  }
  .token {
    position: fixed;
    top: 25%;
    right: 25vw;
    background-color: #fff;
    width: 50vw;
    min-height: 5vh;
    padding: 1em;
    word-wrap: break-word;
    font-size: 40px;
    font-weight: 400;
  }

  .token span {
    display: block;
  }

  .svg-container.clicked + .token {
    display: block;

  }

  .myCards {
    position: absolute;
    bottom: 20vh;
    left: 50%;
    transform: translateX(-50%);
    width: 11vw;
  }

  .otherPlayerInfo{
    position: relative;
  }
  .otherPlayerInfo p{
    font-family: theFont;
    background-color: white;
    margin: 0;
    padding: 1em;
    border-radius: 10px;
    font-size: 15px;
    margin-top: -1em;
    text-transform: uppercase;
    padding-bottom: 0;
    border: 2px solid black;
    z-index: 2;
    position: relative;
  }

  .myCards p{
    font-family: theFont;
    background-color: gold;
    margin: 0;
    padding: 1em 1em 0 1em;
    border-radius: 10px;
    font-size: 20px;
    margin-top: -1em;
    text-transform: uppercase;
    font-weight: 800;
    border: 2px solid black;
    z-index: 2;
    position: relative;
  }
  .card1, .card2{
    width: 5.5vw;
    background: 0;
    position: relative;
    z-index: 2;
    display: none;
  }

  .opponentCards {
    width: 4vw;
    z-index: 2;
    position: relative;
    display: none;
  }
  .leftTilt{
    transform: rotate(-7deg);
  }
  .rightTilt{
      transform: rotate(7deg);
  }
  .userPanel button.red{
    background-color: #c11212;
  }

  .userPanel button.red:hover, .userPanel button.red:active {
    background-color: #f84545;
  }
  .player{
    position: relative;
    display: inline-block;
    margin-top: -10em;
    border-radius: 25px;
    font-size: 16px;
    font-family: theFont;
    margin-right: 7em;
    margin-left: 7em;
    padding: 0;
    width: 8vw;
  }
  .startButtom {
    position: fixed;
    top: 7vh;
    left: 2vw;
  }
  .startButtom button {
    background-color: #1c9999;
    border: 2px solid black;
    width: 15vw;
    height: 7vh;
    cursor: pointer;
    font-weight: 600;
  }

  .startButtom button:hover, .startButtom button:active {
    background-color: #6ff6f6;
  }

  .myDealerChip{
    position: absolute;
    display: none;
    z-index: 9999;

  }

  .dealer-active {
    display: block;
    animation: none;
    width: 2vw;
    animation: dealerAnimation 1.2s ease-in-out;
  }

  .tooltip {
    width: 15vw;
    visibility: hidden;
    background-color: white;
    color: black;
    text-align: center;
    border-radius: 6px;
    position: absolute;
    z-index: 1;
    top: 130%;
    left: -4.5vw;
    text-transform: none;
    padding: 1em;
    font-weight: 700;
  }

  .myPlayer .tooltip {
    left: -3.5vw;
  }

  .tooltip::after {
    content: "";
    position: absolute;
    bottom: 100%;
    left: 50%;
    margin-left: -5px;
    border-width: 5px;
    border-style: solid;
    border-color:  transparent transparent white transparent;
  }

  .visible {
    visibility: visible;
  }

  .currentPlayer::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 10vw;
    height: 10vw;
    background-color: rgba(40, 205, 109, 0.5);
    border-radius: 100%;
    z-index: 1;
    border: 2px dashed rgb(227, 255, 18);
    animation: spin 10s linear infinite;
  }

  .card-display {
    display: inline;
    animation: appearFromTop 0.5s ease-in-out;
  }


  .communityCards {
    position: absolute;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    height: 45vh;
    width:70vw;
    gap: 3em;

  }
  .comCard{
    width: 5vw;
    visibility: hidden;
  }
  .card-visible {
    visibility: visible;
  }

  .raiseContainer {
    position: absolute;
    right: 5vw;
    bottom: 25vh;
    height: 40vh;
    width: 50px;
    color: white;
    display: flex;
    flex-direction: column;
    gap: 1em;
    align-items: center;
  }
  .slider {
    appearance: none;
    -webkit-appearance: none;
    width: 25px;
    height: 100%;
    background: #d3d3d3;
    outline: none;
    opacity: 0.7;
    transition: opacity .2s;
    writing-mode: bt-lr; 
    -webkit-appearance: slider-vertical;
  }

  .slider:hover {
    opacity: 1;
  }

  .fold {
    position: absolute;
    font-size: 4vw;
    color: rgb(154, 152, 152);
    bottom: 160%;
    font-weight: 900;
    font-style: oblique;
    text-decoration:underline;
    animation: appearFromTop 0.5s ease-in-out;
  }



  @keyframes spin {
    from {transform: translate(-50%, -50%) rotate(0);}
    to   {transform: translate(-50%, -50%) rotate(360deg);}
  }

  @keyframes dealerAnimation {
    from {
      width: 20vw;
      opacity: 0;
    }

    to {
      width: 2vw;
      opacity: 1;
    }
  }

  @keyframes appearFromTop {
    from {
      transform: translateY(-100%);
      opacity: 0;
    }

    to {
      transform: translateY(0);
      opacity: 1;
    }
  }

  </style>
  