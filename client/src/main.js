import { createApp } from 'vue'
import App from './App.vue'
import router from './router/router';
import * as api from './apiClient';


import { initializeApp } from "firebase/app";

const getFirebaseConfig = async () => {
  try {
    const response = await api.getFirebase();
    return response;
  } catch (error) {
      console.error('Error',error);
  }
}

let firebaseConfig = await getFirebaseConfig();
initializeApp(firebaseConfig);
const app = createApp(App);

app.use(router);

app.mount('#app');
