import store from '../store';
export const user_routes = [
  {
    path: 'articles',
    name: 'UserArticles',
    component: () => import('@/views/ArticleContainer'),
    props: (route) => {
      if (store.state.user.self.name === route.params.username)
        return {
          type: 'self',
        };
      else
        return {
          type: 'others',
          username: route.params.username,
        };
    },
  },
  {
    path: 'honorRoll',
    name: 'HonorRoll',
    component: () => import('@/views/HonorRoll'),
    // beforeEnter(to, from, next) {
    // },
    props: (route) => {
      return {
        user:
          route.params.username === store.state.user.self.name
            ? store.state.user.self
            : store.state.user.others,
      };
    },
  },
  // {
  //   path: 'article/:id',
  //   name: 'UserArticle',
  //   component: () => import('@/views/Article'),
  //   beforeEnter(to, from, next) {
  //     isLogin().then((res) => {
  //       if (res) {
  //         store
  //           .dispatch('getArticle', { id: to.params.id })
  //           .then(() => {
  //             next();
  //           })
  //           .catch(() => {
  //             next(false);
  //           });
  //       } else next({ name: 'Article', params: { id: to.params.id } });
  //     });
  //   },
  //   props: (route) => {
  //     return {
  //       id: route.params.id,
  //     };
  //   },
  // },
  {
    path: 'upl',
    name: 'Upl',
    component: () => import('@/components/Upl'),
    beforeEnter(to, from, next) {
      if (store.state.is_login) next();
      else next('/login');
    },
  },
];
