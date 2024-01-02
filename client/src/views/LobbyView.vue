
<template>
    <div class="lobby">
      <h1>Welcome to the SuperPoker!</h1>
  
      <form>
        <label for="roomID">Room ID:</label>
        <input v-model="roomID" type="text" placeholder="Enter room name" />
      </form>

      <div class="inputGroup">
        <form @submit.prevent="joinRoom">
          <button type="submit" :disabled="isDisabled">Join Game</button>
        </form>
        <form @submit.prevent="createRoom">
          <button type="submit" :disabled="isCreateDisabled">Create Game</button>
        </form>
      </div>

    </div>
  </template>
<script setup>
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import * as api from '../apiClient';
import { computed, ref} from 'vue';
import router from '@/router/router';

const auth = getAuth();
const isLoggedIn = ref(false);
let roomID = ref('');
let userID = ref('');

onAuthStateChanged(auth, (user) => {
  isLoggedIn.value = !!user;
  if (user) {
    userID.value = user.uid
  }
});

const isDisabled = computed(() => !isLoggedIn.value || roomID.value === '');
const isCreateDisabled = computed(() => !isLoggedIn.value);

const createRoom = async () => {
  console.log('Creating room:', roomID.value);
  try {
    const {id, response} = await api.createRoom({
      hostName: userID.value,
    });
    if (response && response.status === 201) {
      router.push({ name: 'BoardView', params: { id: id.id } });
    }
  } catch (error) {
    console.error('Error creating room:', error);
  }
};

const joinRoom = async () => {
  try {
    const response = await api.joinRoom({
      roomID: roomID.value,
      userID: userID.value,
    });
    if (response && response.status === 200) {
      router.push({ name: 'BoardView', params: { id: roomID.value } });
    }
  } catch (error) {
    console.error('Error creating room:', error);
  }
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
  
  