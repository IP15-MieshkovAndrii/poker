import { createRouter, createWebHistory } from 'vue-router';
import LobbyView from '../views/LobbyView.vue';
import BoardView from '../views/BoardView.vue';
import ProfileView from '../views/ProfileView.vue'

const routes = [
  {
    path: '/',
    name: 'LobbyView',
    component: LobbyView,
  },
  {
    path: '/game/:id',
    name: 'BoardView',
    component: BoardView,
  },
  {
    path: '/profile',
    name: 'ProfileView',
    component: ProfileView,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
