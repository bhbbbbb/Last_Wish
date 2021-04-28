import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store/index'
Vue.use(VueRouter)

const routes = [
  
  {
    path: '/',
    name: 'Home',
    props: {
      Main: false,
      AppBar: {
        links: store.state.global_links
      }
    },
    components: {
      Main: () => import('@/views/Home/Home.vue'),
      AppBar: () => import('@/views/app_bar.vue')
        
    },
    redirect: {name: 'Articles'},
    children: [
      {
        path: 'articles',
        name: 'Articles',
        component: () => import('@/views/ArticleContainer'),
      },
      {
        path: 'register',
        name: 'Register',
        component: () => import('@/views/Home/Register'),
      },
      {
        path: 'login',
        name: 'Login',
        component: () => import('@/components/MyLogin'),
      }
    ]
  },


  {
    path: '/:username',
    name: 'User',
    props: {
      Main: false,
      AppBar: {
        links: store.state.user_links
      }
    },
    components: {
      Main: () => import('@/views/User/User'),
      AppBar: () => import('@/views/app_bar.vue'),
    },
    beforeEnter: (to, from, next) => {
      // console.log(from);
      if (store.state.is_login) {
        next();
        return true;
      }

      if (!store.state.is_login || to.params.username != store.state.username) {
        // alert("u have not log in");
        next({name: 'Articles'});
        return false;
      }

      next({name: 'Articles'});
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
