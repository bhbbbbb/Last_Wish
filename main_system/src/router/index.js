import Vue from 'vue'
import VueRouter from 'vue-router'
// import store from '@/store/index'
import { isLogin } from '@/router/log'
Vue.use(VueRouter)

const routes = [
  
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/Home/Home'),
    redirect: {name: 'Articles'},
    beforeEnter(to, from, next) {
      isLogin(to).then(() => {
        // if(res) next({name: 'UserArticle', params: {username: store.state.username}});
        // else next();

        next();
      }).catch(() => {
        next(false);
      })
    },
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
        component: () => import('@/views/Home/MyLogin'),
      },
      {
        path: 'article/:id',
        name: 'Article',
        component: () => import('@/views/Article'),
        props: (route) => {
          
          return {id: Number(route.params.id)};
        }
      },
      {
        path: ':username',
        name: 'User',
        beforeEnter: (to, from, next) => {
          isLogin(to).then(res => {
            if (res) next();
            else next({name: 'Articles'});
          }).catch(() => {
            next(false);
          })
        },
        redirect: {name: 'Articles'},
      },
      {
        path: ':username/profile',
        name: 'Profile',
        component: () => import('@/views/User/Profile')
      }
    ]
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
