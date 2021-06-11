import store from '../store';
import { isLogin } from '@/lib/log';
export const user_routes = [
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
    path: 'honorRoll',
    name: 'HonorRoll',
    component: () => import('@/views/HonorRoll'),
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
  {
    path: 'upl',
    name: 'Upl',
    component: () => import('@/components/Upl'),
  },
];
