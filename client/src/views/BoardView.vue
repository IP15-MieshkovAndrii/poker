<template>
    <div class="board">
      <div class="table">
        <div class="pot">
          POT SIZE: 0
        </div>
        <div class="myCards">
          <img class="card1 leftTilt" src="../assets/img/back.png">
          <img class="card2 rightTilt" src="../assets/img/back.png">
          <div class="myPlayer">
            <p>
              <span class="myName">{{ playerName }}</span><br>
              <span class="myStack">2000</span>
            </p>
          </div>
        </div>
      </div>
      <div class="userPanel">
        <button>FOLD</button>
        <button>CHECK</button>
        <button>CALL</button>
        <button>RAISE</button>
      </div>
      <div class="svg-container" @click="toggleTokenVisibility">
        <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="30" height="30" viewBox="0,0,256,256">
          <g fill="#7ab3f8" fill-rule="nonzero" stroke="none" stroke-width="1" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0" font-family="none" font-weight="none" font-size="none" text-anchor="none" style="mix-blend-mode: normal"><g transform="scale(5.12,5.12)"><path d="M40,0c-5.46484,0 -9.92187,4.39844 -10,9.84375c0,0.05078 0,0.10547 0,0.15625c0,3.6875 1.99609,6.89063 4.96875,8.625c1.47656,0.86328 3.19922,1.375 5.03125,1.375c5.51563,0 10,-4.48437 10,-10c0,-5.51562 -4.48437,-10 -10,-10zM28.0625,10.84375l-10.21875,5.125c2.37891,2.0625 3.94141,5.03125 4.125,8.375l10.34375,-5.1875c-2.41406,-2.02734 -4.01172,-4.98047 -4.25,-8.3125zM10,15c-5.51562,0 -10,4.48438 -10,10c0,5.51563 4.48438,10 10,10c2.05078,0 3.94141,-0.625 5.53125,-1.6875c2.68359,-1.79297 4.46875,-4.83984 4.46875,-8.3125c0,-3.58984 -1.91016,-6.73437 -4.75,-8.5c-1.53125,-0.95312 -3.32031,-1.5 -5.25,-1.5zM21.96875,25.65625c-0.18359,3.33984 -1.71875,6.33984 -4.09375,8.40625l10.1875,5.09375c0.23828,-3.33203 1.80859,-6.28125 4.21875,-8.3125zM40,30c-2.0625,0 -3.96875,0.64453 -5.5625,1.71875c-2.66797,1.79688 -4.4375,4.82422 -4.4375,8.28125c0,0.01563 0,0.01563 0,0.03125c-0.04297,0.00391 -0.08203,0.02734 -0.125,0.03125l0.125,0.0625c0.06641,5.45703 4.52734,9.875 10,9.875c5.51563,0 10,-4.48437 10,-10c0,-5.51562 -4.48437,-10 -10,-10z"></path></g></g>
        </svg>
      </div>
      <div class="token" v-if="isTokenVisible">
        <span>Share room id: {{ token }}</span>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'BoardView',
    data() {
        return {
          token: this.$route.params.token || '',
          isTokenVisible: false,
          playerName: this?.$socket?.nickname || 'Name',
        };
    },
    methods: {
      toggleTokenVisibility() {
        this.isTokenVisible = !this.isTokenVisible;
        console.log(this?.$socket)
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
    color: #fff;
    margin-top:1em;
    font-size: 2vw;
    font-weight: 600;
  }
  .userPanel{
    position: fixed;
    left: 3vw;
    top: 20%;
    display: flex;
    flex-direction: column;
    gap: 3em;
  }

  .userPanel button {
    background-color: #998e1c;
    border: 2px solid black;
    width: 15vw;
    height: 5vh;
    cursor: pointer;
  }
  .userPanel button:hover, .userPanel button:active {
    background-color: #cdbb31;
  }

  .svg-container {
    position: relative;
    cursor: pointer;
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

  .myCards{
    position: absolute;
    bottom: 10vh;
    left: 50%;
    transform: translateX(-50%);
  }

  .myCards p{
    font-family: theFont;
    background-color: white;
    margin: 0;
    padding: 1em;
    border-radius: 10px;
    font-size: 20px;
    margin-top: -1em;
    text-transform: uppercase;
  }

  .card1, .card2{
    width: 5.5vw;
  }
  .leftTilt{
    transform: rotate(-7deg);
  }

  .rightTilt{
      transform: rotate(7deg);
  }

  .myStack{
    float: left;
    margin-left: 2em;
  }
  </style>
  