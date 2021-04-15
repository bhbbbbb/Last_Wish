import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '@/views/Home.vue'
import store from '@/store/index'
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/home',
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
    path: '/:username',
    name: 'User',
    component: () => import('@/views/User'),
    beforeEnter: (to, from, next) => {
      console.log(from);
      if (store.state.is_login) {
        next();
        return true;
      }
      // console.log(store.state.is_login, to.params.username, store.state.username)
      if (!store.state.is_login || to.params.username != store.state.username) {
        alert("u have not log in");
        next('/home');
        return false;
      }
      // alert("login success");
      next('/home');
      return true;
    },
    
    children: [
      {
        path: 'articles',
        name: 'UserArticle',
        component: () => import('@/views/Home/ArticleContainer')
      },
    ]
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
