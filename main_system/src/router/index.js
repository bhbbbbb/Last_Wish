import Vue from 'vue'
import VueRouter from 'vue-router'
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
    components: {
      Main: () => import('@/views/Home/Home.vue'),
      AppBar: () => import('@/views/Home/app_bar.vue')
    },
    redirect: '/home/articles',
    children: [
      {
        path: 'articles',
        name: 'ArticleContainer',
        component: () => import('@/views/ArticleContainer')
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
    components: {
      Main: () => import('@/views/User/User'),
      AppBar: () => import('@/views/User/app_bar.vue'),
    },
    beforeEnter: (to, from, next) => {
      console.log(from);
      if (store.state.is_login) {
        next();
        return true;
      }
      // console.log(store.state.is_login, to.params.username, store.state.username)
      if (!store.state.is_login || to.params.username != store.state.username) {
        alert("u have not log in");
        next('/vistor');
        return false;
      }
      // alert("login success");
      next('/vistor');
      return true;
    },
    
    children: [
      {
        path: 'articles',
        name: 'UserArticle',
        component: () => import('@/views/ArticleContainer')
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
