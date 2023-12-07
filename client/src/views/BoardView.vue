<template>
    <div class="board">
      <div class="table">
        <div class="pot">
          POT SIZE: 0
        </div>
      </div>
      <div class="userPanel">
        <button>FOLD</button>
        <button>CHECK</button>
        <button>CALL</button>
        <button>RAISE</button>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'BoardView',
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
  </style>
  