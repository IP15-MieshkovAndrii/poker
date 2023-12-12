
<template>
    <div class="lobby">
      <h1>Welcome to the SuperPoker!</h1>
  
      <form>
        <label for="nickname">Enter Nickname:</label>
        <input v-model="nickname" type="text" required placeholder="Enter nickname" />
      </form>
  
      <form>
        <label for="roomID">Room ID:</label>
        <input v-model="roomID" type="text" placeholder="Enter room name" />
      </form>

      <div class="inputGroup">
        <form @submit.prevent="joinRoom">
          <button type="submit" :disabled="(nickname === '')||(roomID === '')">Join Game</button>
        </form>
        <form @submit.prevent="createRoom">
          <button type="submit" :disabled="(nickname === '')">Create Game</button>
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
        roomID: '',
        nickname: '',
      };
    },
    methods: {
      async createRoom() {

        console.log('Creating room:', this.nickname);
        try {
          const response = await api.createRoom({
            hostName: this.nickname,
          });
          if(response.status === 201){
            sessionStorage.setItem('nickname', this.nickname);
            this.$router.push({ name: 'BoardView', params: { id: response.data.id } });
            
          }
  
        } catch (error) {
          console.error('Error creating room:', error);
        }
      },


      async joinRoom() {
        try {
          const response = await api.getRoom({
              roomID: this.roomID,
              nickname: this.nickname,
            });
          if(response.status === 200){
            sessionStorage.setItem('nickname', this.nickname);
            this.$router.push({ name: 'BoardView', params: { id: this.roomID } });

          }
  
        } catch (error) {
          console.error('Error creating room:', error);
        }

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
    margin-top: 60px;
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
  
  