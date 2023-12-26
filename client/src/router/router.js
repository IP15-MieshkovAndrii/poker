import { createRouter, createWebHistory } from 'vue-router';
import LobbyView from '../views/LobbyView.vue';
import BoardView from '../views/BoardView.vue';
import ProfileView from '../views/ProfileView.vue';
import RegisterView from '../views/RegisterView.vue';
import SignInView from '../views/SignInView.vue';
import { getAuth, onAuthStateChanged} from "firebase/auth"

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
    meta: {
      requiresAuth: true,
    }
  },
  {
    path: '/profile',
    name: 'ProfileView',
    component: ProfileView,
    meta: {
      requiresAuth: true,
    }
  },
  {
    path: '/register',
    name: 'RegisterView',
    component: RegisterView,
  },
  {
    path: '/sign-in',
    name: 'SignInView',
    component: SignInView,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

const getCurrentUser = () => {
  return new Promise((resolve, reject) => {
    const removeListener = onAuthStateChanged(
      getAuth(),
      (user) => {
        removeListener();
        resolve(user);
      },
      reject
    );
  })
};

router.beforeEach(async (to, from, next) => {
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (await getCurrentUser()) {
      next();
    } else {
      alert("You don't have access!")
      next("/register")
    }
  } else {
    next();
  }
})

export default router;
