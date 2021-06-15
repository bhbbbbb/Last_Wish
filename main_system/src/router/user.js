import store from '../store';
// import { isLogin } from '@/lib/log';
export const user_routes = [
  {
    path: 'articles',
    name: 'UserArticles',
    component: () => import('@/views/ArticleContainer'),
    // TODO : redirect un login visiter to public profile page
    beforeEnter(to, from, next) {
      if (store.state.is_login) {
        if (store.state.article.user.length) next();
        else {
          next();
          // store.dispatch('getUserArticles');
        }
      } else next('/articles');
    },
    props: () => ({
      articles: store.state.article.user,
      fetchAction: 'getUserArticles',
    }),
  },
  {
    path: 'honorRoll',
    name: 'HonorRoll',
    component: () => import('@/views/HonorRoll'),
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
  },
];
