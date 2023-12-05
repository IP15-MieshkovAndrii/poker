
<template>
    <div class="lobby">
      <h1>Welcome to the SuperPoker!</h1>
  
      <form>
        <label for="nickname">Enter Nickname:</label>
        <input v-model="nickname" type="text" required placeholder="Enter nickname" />
      </form>
  
      <form>
        <label for="roomName">Room:</label>
        <input v-model="roomName" type="text" required placeholder="Enter room name" />
      </form>

      <form>
        <label for="password">Password:</label>
        <input v-model="password" type="text" required placeholder="Enter password" />
      </form>

      <div class="inputGroup">
        <form @submit.prevent="joinRoom">
          <button type="submit" :disabled="(nickname === '')||(roomName === '')||(password === '')">Join Game</button>
        </form>
        <form @submit.prevent="createRoom">
          <button type="submit" :disabled="(nickname === '')||(roomName === '')||(password === '')">Create Game</button>
        </form>
      </div>

    </div>
  </template>
  
  <script>
  import * as api from '../apiClient';

  export default {
    name: 'LobbyView',
    data() {
      return {
        roomName: '',
        nickname: '',
        password: ''
      };
    },
    methods: {
      async createRoom() {

        console.log('Creating room:', this.roomName, this.nickname, this.password);
        try {
          const response = await api.createRoom({
            roomName: this.roomName,
            hostName: this.nickname,
            password: this.password
          });
          if(response.status === 201){
            this.$router.push({ name: 'BoardView'});
          }
  
        } catch (error) {
          console.error('Error creating room:', error);
        } finally {
          // this.roomName = '';
        }
      },


      async joinRoom() {
        console.log('Joining room:', this.roomName, this.nickname, this.password);

      },
    },
  };
  </script>
  
  <style scoped>
  .lobby {
    padding: 20px;
    background-color: rgb(174, 197, 174);
    display: flex;
    align-items: center;
    flex-direction: column;
  }
  
  form {
    margin-bottom: 10px;
    width: 30vw;
  }
  
  .inputGroup {
    display: flex;
    justify-content: space-between;
    width: 30vw;
    gap: 3vw;
    margin-top: 1.5em;
  }

  
  label {
    display: block;
    margin-bottom: 5px;
  }
  
  input {
    width: calc(100% - 8px);
    height: 2vw;
  }
  
  button {
    width: 100%;
    height: calc(4vw + 12px);
    font-size: 2vw;
  }
  </style>
  
  