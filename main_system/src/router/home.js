import store from '../store';
export const home_routes = [
  {
    path: 'articles',
    name: 'Articles',
    component: () => import('@/views/ArticleContainer'),
    props: () => ({
      type: 'global',
    }),
  },
  {
    path: 'reset',
    name: 'Reset',
    component: () => import('@/views/Reset'),
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
    props: true,
  },
  // {
  //   path: 'article/:id/wish/:wish',
  //   name: 'Wish',
  //   component: () => import('@/views/Wish'),
  //   props: (route) => ({
  //     context: route.params.context,
  //     color: route.params.color,
  //   }),
  // },
  // {
  //   path: 'article/:id/new_milestone',
  //   name: 'NewMilestone',
  //   component: () => import('@/views/NewMilestone'),
  //   props: (route) => ({
  //     id: route.params.id,
  //     wishes: route.params.wishes,
  //   }),
  //   beforeEnter(to, from, next) {
  //     if (!to.params.wishes)
  //       next({ name: 'Article', params: { id: to.params.id } });
  //     else next();
  //   },
  // },
  // {
  //   path: 'article/:id/clone',
  //   name: 'ArticleClone',
  //   component: () => import('@/views/ClonePostCard'),
  //   props: (route) => ({
  //     newArticle: route.params.newArticle,
  //   }),
  //   beforeEnter(to, from, next) {
  //     if (!to.params.newArticle) {
  //       if (to.params.id)
  //         next({ name: 'Article', params: { id: to.params.id } });
  //       else next(false);
  //     }
  //     next();
  //   },
  // },
  {
    path: 'newpost',
    name: 'NewPost',
    component: () => import('@/views/NewPost'),
    beforeEnter(to, from, next) {
      if (store.state.is_login) next();
      else next('/articles');
    },
    meta: {
      keepAlive: true,
    },
  },
  {
    path: 'link',
    name: 'Link',
    component: () => import('@/views/Link'),
    beforeEnter(to, from, next) {
      if (store.state.is_login && to.params.reference) next();
      else next('/articles');
    },
    props: true,
  },
  {
    path: 'follow_article',
    name: 'FollowArticles',
    component: () => import('@/views/FollowArticles'),
    beforeEnter(to, from, next) {
      if (store.state.is_login) next();
      else next('/');
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
