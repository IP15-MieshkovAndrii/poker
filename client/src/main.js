import { createApp } from 'vue'
import App from './App.vue'
import router from './router/router';


import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyC-myiYCFc2KY5VclfbbdjO0GTxtZRndH4",
  authDomain: "poker-2a187.firebaseapp.com",
  projectId: "poker-2a187",
  storageBucket: "poker-2a187.appspot.com",
  messagingSenderId: "184546968135",
  appId: "1:184546968135:web:4a33dc8657b420d803a762"
};

initializeApp(firebaseConfig);

const app = createApp(App);

app.use(router);

app.mount('#app');
