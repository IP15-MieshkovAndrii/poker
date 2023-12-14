<template>
    <div class="board">
      <div class="startButtom" v-if="isHost && !gameStarted">
        <button @click="startGame">START</button>
      </div>
      <div class="table">
        <div class="pot" v-if="gameStarted">
          POT SIZE: 0
        </div>
        <div class="myCards">
          <img class="card1 leftTilt" src="../assets/img/back.png">
          <img class="card2 rightTilt" src="../assets/img/back.png">
          <div class="myPlayer">
            <img class="myDealerChip" :class="{ 'dealer-active': playerName === dealer }" src="../assets/img/DEALER-CHIP.png">
            <p>
              <span class="myName">You</span><br>
              <span class="myStack">{{chips}}</span>
            </p>
          </div>
        </div>
        <div class="players">
          <div v-for="user in users" :key="user.nickname" class="player">
            <img class="opponentCards leftTilt" src="../assets/img/back.png">
            <img class="opponentCards rightTilt" src="../assets/img/back.png">
            <div class="otherPlayerInfo">
              <img class="myDealerChip" :class="{ 'dealer-active': user === dealer }" src="../assets/img/DEALER-CHIP.png">
              <p>
                <span class="opponentPlayerName">{{ user }}</span><br>
                <span class="opponentStackSize">{{user.chips || 2000}}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
      <div class="userPanel">
          <button>FOLD</button>
          <button>CHECK</button>
          <button>CALL</button>
          <button>RAISE</button>

        <button class="red" @click="leaveRoom">LEAVE</button>
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
          socket: new WebSocket('ws://127.0.0.1:8000/game'),
          otherPlayers: [],
          hostName: this.getHost() || '',
          gameStarted: JSON.parse(sessionStorage.getItem('game'))?.gameStarted || false,
          isHost: false,
          allUsers: [],
          dealer: 'Name',
          pokerTable: {},
          chips: 2000,
        };
    },
    methods: {
      toggleTokenVisibility() {
        this.isIDVisible = !this.isIDVisible;
        console.log(this?.$socket)
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

      getUsers() {
        this.socket.send(JSON.stringify({ type: 'getUsersInRoom', room: this.id }));
      },

      handleSocketMessage(event) {
        const data = JSON.parse(event.data);
        if(this.id === data.id){
          if (data.type === 'usersInRoom') {
            const array = data.users;
            this.otherPlayers = array
          }
          if (data.type === 'gameBegun') {
            this.gameStarted = true;
            this.dealer = data.dealer;
            this.pokerTable = data.pokerTable;

            this.otherPlayers = this.pokerTable.getPlayers()

            poker.startGame(this.id, this.allUser);
          }
        }
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
        this.socket.send(JSON.stringify({ type: 'startGame', room: this.id }));
      }
    },

    created() {
      this.socket.addEventListener('open', () => {
        this.handleSocketOpen();
        this.getUsers();
      } );
      this.socket.addEventListener('close', () => {
        console.log('Closed');
        this.getUsers();
      });
      this.socket.addEventListener('message', (event) => {
        this.handleSocketMessage(event);
      });
    },

    computed: {
      users() {
        if(this.otherPlayers && this.otherPlayers.length === 1) return [];
        if(this.allUsers.length === 0) {
          return this.otherPlayers.filter(user => user !== this.playerName);
        }
        return this.allUsers.filter(user => user.name !== this.playerName);
      },
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
    height:calc(50vh);
    width:calc(70vw);
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
  }
  .card1, .card2{
    width: 5.5vw;
    background: 0;
    display: none;
  }

  .opponentCards {
    width: 4vw;
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
    position:absolute;
    display: none;
    width: 2vw;
  }

  .dealer-active {
    display: block;
  }
  </style>
  