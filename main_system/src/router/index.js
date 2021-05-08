import Vue from 'vue'
import VueRouter from 'vue-router'
// import store from '@/store/index'
import { isLogin } from '@/router/log'
import store from '../store'
Vue.use(VueRouter)

const routes = [
  
  {
    path: '/',
    name: 'Home',
    components: {
      AppBar: () => import('@/views/AppBar/AppBarWrap'),
      Main: () => import('@/views/Home/Home'),
      Footer: () => import('@/views/Footer/FooterWrap')
    },
    // props: {
    //   AppBar: false,
    //   Main: false,
    //   Footer: false
    // },
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
        beforeEnter(to, from, next) {
          if (store.state.is_login) next('/articles');
          else next();
        }
      },
      {
        path: 'login',
        name: 'Login',
        component: () => import('@/views/Home/MyLogin'),
        beforeEnter(to, from, next) {
          if (store.state.is_login) next('/articles');
          else next();
        }
      },
      {
        path: 'article/:id',
        name: 'Article',
        component: () => import('@/views/Article'),
        props: (route) => {
          
          return {id: Number(route.params.id)};
        }
      },
    ]
  },
  {
    path: '/:username',
    name: 'User',
    components: {
      AppBar: () => import('@/views/Profile/AppBarProfileM'),
      Main: () => import('@/views/Home/Home'),
      Footer: () => import('@/views/Footer/FooterWrap')
    },
    // beforeEnter: (to, from, next) => {
    //   isLogin().then(res => {
    //     if (res) next();
    //     else next({name: 'Articles'});
    //   }).catch(() => {
    //     next(false);
    //   })
    // },
    redirect: {name: 'UserArticles'},
    children: [
      {
        path: 'articles',
        name: 'UserArticles',
        component: () => import('@/views/Profile/UserArticles'),
        // TODO : redirect un login visiter to public profile page
        beforeEnter(to, from, next) {
          // console.log(to, from);
          next();
        }
      },
      {
        path: 'article/:id',
        name: 'UserArticle',
        component: () => import('@/views/Article'),
        beforeEnter(to, from, next) {
          isLogin().then(res => {
            if (res) next();
            else next({name: 'Article', params: {id: to.params.id}});
          })
        },
        props: (route) => ({id: Number(route.params.id)})
      }
    ]
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  isLogin().then(() => { next() }).catch(() => next(false));
})

export default router
