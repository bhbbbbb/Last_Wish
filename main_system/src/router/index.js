import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '@/views/Home.vue'
import store from '@/store/index'
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/home',
    name: 'Home',
    component: Home,
    redirect: '/home/articles',
    children: [
      {
        path: 'articles',
        name: 'ArticleContainer',
        component: () => import('@/views/Home/ArticleContainer')
      },
      {
        path: 'register',
        name: 'Register',
        component: () => import('@/views/Home/Register')
      }]
  },
  {
    path: '/user/:username',
    name: 'User',
    component: () => import('@/views/User'),
    beforeEnter: (to, from, next) => {
      console.log(to, from);
      if (!store.state.is_login || to.params.username != store.state.username) {
        alert("u have not log in");
        // next('/home');
        return false;
      }
      next();
      return true;
    }
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
