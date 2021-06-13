import store from '../store';
export const home_routes = [
  {
    path: 'articles',
    name: 'Articles',
    component: () => import('@/views/ArticleContainer'),
    beforeEnter(to, from, next) {
      // TODO : may need to update global_articles
      next();
      if (store.state.global_articles.length === 0) {
        // store.dispatch('getGlobalArticles');
      }
      // if (store.state.global_articles) next();
      // else {
      //   store
      //     .dispatch('getGlobalArticles')
      //     .then(() => {
      //       // console.log(store.state.global_articles);
      //       next();
      //     })
      //     .catch((err) => {
      //       console.log(err);
      //       next(false);
      //     });
      // }
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
    path: 'reset',
    name: 'Reset',
    component: () => import('@/views/Home/Register'),
    beforeEnter(to, from, next) {
      console.log(to.query.token);
      if (to.query.token) next();
      else next(false);
    },
  },
  {
    path: 'article/:id',
    name: 'Article',
    component: () => import('@/views/Article'),
    beforeEnter(to, from, next) {
      store
        .dispatch('getArticle', { id: to.params.id })
        .then(() => {
          next();
        })
        .catch(() => {
          next(false);
        });
    },
    props: (route) => {
      return {
        id: route.params.id,
      };
    },
    // props: (route) => {
    //   let context = route.params.context
    //     ? route.params.context
    //     : store.state.global_articles[route.params.id];
    //   return {
    //     id: route.params.id,
    //     context: context,
    //   };
    // },
  },
  {
    path: 'article/:id/wish/:wish',
    name: 'Wish',
    component: () => import('@/views/Wish'),
    props: (route) => ({
      context: route.params.context,
      color: route.params.color,
    }),
  },
  {
    path: 'article/:id/new_milestone',
    name: 'NewMilestone',
    component: () => import('@/views/NewMilestone'),
    props: (route) => ({
      id: route.params.id,
      wishes: route.params.wishes,
    }),
    beforeEnter(to, from, next) {
      if (!to.params.wishes)
        next({ name: 'Article', params: { id: to.params.id } });
      else next();
    },
  },
  {
    path: 'aritcle/:id/edit',
    name: 'ArticleEdit',
    component: () => import('@/views/ArticleEdit'),
    props: (route) => ({
      id: route.params.id,
      context: route.params.context,
      author: route.params.author,
    }),
    beforeEnter(to, from, next) {
      if (!to.params.context)
        next({ name: 'Article', params: { id: to.params.id } });
      else next();
    },
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
    beforeEnter(to, from, next) {
      if (store.state.followed_articles.length) next();
      else
        store.dispatch('getUserFollowed').then(() => {
          next();
        });
    },
  },
  // {
  //   path: 'following',
  //   name: 'Following',
  //   component: () => import('@/views/Following'),
  // },
  {
    path: 'calendar',
    name: 'Calendar',
    component: () => import('@/views/Calendar'),
  },
];
