import Vue from 'vue';
import VueRouter from 'vue-router';
// import store from '@/store/index'
import { isLogin } from '@/router/log';
import store from '../store';
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
    // props: {
    //   AppBar: false,
    //   Main: false,
    //   Footer: false
    // },
    redirect: { name: 'Articles' },
    children: [
      {
        path: 'articles',
        name: 'Articles',
        component: () => import('@/views/ArticleContainer'),
        beforeEnter(to, from, next) {
          // TODO : may need to update global_articles
          if (store.state.global_articles) next();
          else {
            store
              .dispatch('getGlobalArticles')
              .then(() => {
                // console.log(store.state.global_articles);
                next();
              })
              .catch(() => {
                next(false);
              });
          }
        },
        props: () => ({
          articles: store.state.global_articles,
        }),
      },
      {
        path: 'register',
        name: 'Register',
        component: () => import('@/views/Home/Register'),
        beforeEnter(to, from, next) {
          if (store.state.is_login) next('/articles');
          else next();
        },
      },
      {
        path: 'login',
        name: 'Login',
        component: () => import('@/views/Home/MyLogin'),
        beforeEnter(to, from, next) {
          if (store.state.is_login) next('/articles');
          else next();
        },
      },
      {
        path: 'article/:id',
        name: 'Article',
        component: () => import('@/views/Article'),
        beforeEnter(to, from, next) {
          if (!store.state.global_articles) {
            store
              .dispatch('getGlobalArticles')
              .then(() => {
                next();
              })
              .catch(() => {
                next(false);
              });
          } else next();
        },
        props: (route) => {
          let context = route.params.context
            ? route.params.context
            : store.state.global_articles[route.params.id];
          return {
            id: Number(route.params.id),
            context: context,
            color: route.params.color,
          };
        },
      },
      {
        path: 'article/:id/:wish',
        name: 'Wish',
        component: () => import('@/views/Wish'),
        props: (route) => ({
          context: route.params.context,
        }),
      },
      {
        path: 'article/:id/clone',
        name: 'ArticleClone',
        component: () => import('@/views/ClonePostCard'),
        props: (route) => ({
          newArticle: route.params.newArticle,
        }),
        beforeEnter(to, from, next) {
          if (!to.params.newArticle) {
            if (to.params.id)
              next({ name: 'Article', params: { id: to.params.id } });
            else next(false);
          }
          next();
        },
      },
      {
        path: 'newpost',
        name: 'NewPost',
        component: () => import('@/views/NewPost'),
        beforeEnter(to, from, next) {
          if (store.state.is_login) next();
          else next('/articles');
        },
      },
      {
        path: 'follow_article',
        name: 'FollowArticle',
        component: () => import('@/views/FollowArticle'),
      },
      {
        path: 'following',
        name: 'Following',
        component: () => import('@/views/Following'),
      },
    ],
  },
  {
    path: '/:username',
    name: 'User',
    components: {
      AppBar: () => import('@/views/Profile/AppBarProfileM'),
      Main: () => import('@/views/Home/Home'),
      Footer: () => import('@/views/Footer/FooterWrap'),
    },
    // beforeEnter: (to, from, next) => {
    //   isLogin().then(res => {
    //     if (res) next();
    //     else next({name: 'Articles'});
    //   }).catch(() => {
    //     next(false);
    //   })
    // },
    redirect: { name: 'UserArticles' },
    children: [
      {
        path: 'articles',
        name: 'UserArticles',
        component: () => import('@/views/ArticleContainer'),
        // TODO : redirect un login visiter to public profile page
        beforeEnter(to, from, next) {
          if (store.state.is_login) {
            if (store.state.user_articles) next();
            else {
              store
                .dispatch('getUserArticles')
                .then(() => {
                  next();
                })
                .catch(() => {
                  next(false);
                });
            }
          } else next('/articles');
        },
        props: () => ({
          articles: store.state.user_articles,
          toUser: true,
        }),
      },
      {
        path: 'article/:id',
        name: 'UserArticle',
        component: () => import('@/views/Article'),
        beforeEnter(to, from, next) {
          isLogin().then((res) => {
            if (res) {
              if (!store.state.global_articles) {
                store
                  .dispatch('getGlobalArticles')
                  .then(() => {
                    next();
                  })
                  .catch(() => {
                    next(false);
                  });
              } else next();
            } else next({ name: 'Article', params: { id: to.params.id } });
          });
        },
        props: (route) => {
          let context = route.params.context
            ? route.params.context
            : store.state.global_articles[route.params.id];
          return {
            id: Number(route.params.id),
            context: context,
            color: route.params.color,
          };
        },
      },
    ],
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
