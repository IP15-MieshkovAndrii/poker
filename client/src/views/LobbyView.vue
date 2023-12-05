<!-- LobbyView.vue -->

<template>
  <div class="lobby">
    <h1>Welcome to the InsectPoker!</h1>

    <form>
      <label for="nickname">Enter Nickname:</label>
      <input v-model="nickname" type="text" required placeholder="Enter nickname" />
    </form>

    <form @submit.prevent="joinRoom">
      <label for="roomId">Join Room by ID:</label>
      <div class="input-group">
        <input v-model="roomId" type="text" id="roomId" required placeholder="Enter room ID" />
        <button type="submit" :disabled="nickname === ''">Join</button>
      </div>
    </form>

    <form @submit.prevent="createRoom">
      <label for="newRoomName">Create a New Room:</label>
        <button type="submit" :disabled="nickname === ''">Create</button>
    </form>
  </div>
</template>

<script>
export default {
  name: 'LobbyView',
  data() {
    return {
      newRoomName: '',
      roomId: '',
      nickname: '',
    };
  },
  methods: {
    async createRoom() {
      try {
        const response = await this.$http.post('/api/rooms', {
          roomName: this.newRoomName,
          nickname: this.hostName,
        });

        console.log(response)
        // const roomId = response.data.id;

        // this.$router.push({ name: 'BoardView', params: { roomId } });

      } catch (error) {
        console.error('Error creating room:', error);
      } finally {
        this.newRoomName = '';
      }
    },
    joinRoom() {
      console.log('Joining room:', this.roomId, this.nickname);
      this.roomId = '';
    },
  },
};
</script>

<style scoped>
.lobby {
  padding: 20px;
  background-color: #f0f0f0;
  display: flex;
  align-items: center;
  flex-direction: column;
}

form {
  margin-bottom: 10px;
  width: 30vw;
}

.input-group {
  display: flex;
  justify-content: space-between;
  width: 30vw;
}
.input-group input {
  max-width: 80%;
}

.input-group button {
  max-width: 20%;
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
  height: calc(2vw + 6px);
}
</style>
