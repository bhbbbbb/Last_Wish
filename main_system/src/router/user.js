import store from '../store';
// import { isLogin } from '@/lib/log';
export const user_routes = [
  {
    path: 'articles',
    name: 'UserArticles',
    component: () => import('@/views/ArticleContainer'),
    props: (route) => {
      if (store.state.user.self.name === route.params.username)
        return {
          articles: store.state.article.self,
          fetchAction: 'getSelfArticles',
        };
      else
        return {
          articles: store.state.article.others,
          fetchAction: 'getOthersArticles',
          username: route.params.username,
        };
    },
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
