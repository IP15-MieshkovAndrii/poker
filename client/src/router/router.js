import { createRouter, createWebHistory } from 'vue-router';
import LobbyView from '../views/LobbyView.vue';
import BoardView from '../views/BoardView.vue';

const routes = [
  {
    path: '/',
    name: 'LobbyView',
    component: LobbyView,
  },
  {
    path: '/game',
    name: 'BoardView',
    component: BoardView,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
