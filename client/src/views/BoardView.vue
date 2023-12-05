<template>
    <div class="board">
      <h1>Room {{ roomId }}</h1>
    </div>
  </template>
  
  <script>
  export default {
    name: 'BoardView',
    props: ['roomId'],
  };
  </script>
  
  <style scoped>
  .board {
    padding: 20px;
    background-color: #f0f0f0;
  }
  </style>
  