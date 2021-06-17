import Vue from 'vue';
import VueRouter from 'vue-router';
// import store from '@/store/index'
import { isLogin } from '@/lib/log';
// import store from '../store';
import { home_routes } from './home';
import { user_routes } from './user';
import store from '../store';
// import store from '../store';
Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Home',
    components: {
      AppBar: () => import('@/views/AppBar/AppBarWrap'),
      Main: () => import('@/views/Home/Home'),
      Footer: () => import('@/views/Footer/FooterWrap'),
    },
    redirect: { name: 'Articles' },
    children: home_routes,
  },
  {
    path: '/:username',
    name: 'User',
    components: {
      AppBar: () => import('@/views/Profile/AppBarProfileM'),
      Main: () => import('@/views/Home/Home'),
      Footer: () => import('@/views/Footer/FooterWrap'),
    },
    beforeEnter(to, from, next) {
      if (store.state.user.self.name !== to.params.username)
        store.dispatch('getOthersByName', to.params.username).then(() => {
          next();
        });
      else next();
    },
    redirect: { name: 'UserArticles' },
    children: user_routes,
    props: {
      AppBar: true,
    },
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach((to, from, next) => {
  isLogin()
    .then(() => {
      next();
    })
    .catch(() => next(false));
});

export default router;
