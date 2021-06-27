import store from '../store';
export const frameless_routes = [
  {
    path: 'login',
    name: 'Login',
    alias: '/login',
    component: () => import('@/views/Frameless/MyLogin'),
    beforeEnter(to, from, next) {
      if (store.state.is_login) next('/articles');
      else next();
    },
  },
  {
    path: 'register',
    name: 'Register',
    alias: '/register',
    component: () => import('@/views/Frameless/Register'),
    beforeEnter(to, from, next) {
      if (store.state.is_login) next('/articles');
      else next();
    },
  },
];
