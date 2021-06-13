import Vue from 'vue';
import Vuex from 'vuex';
import {
  apiGetArticles,
  apiGetArticleById,
  apiGetPublicInfo,
  apiLogout,
  apiTryLogin,
  apiGetUserPosts,
  apiUserFollowedPosts,
} from './api';
// import { apiGetArticles } from './api.js'
import router from '@/router/index';
import { global_links, user_links } from './links.js';
Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    article_data: {},
    global_articles: [],
    user_articles: [],
    followed_articles: undefined,
    user: {
      name: undefined,
      id: undefined,
      pro_pic: undefined,
    },
    // username: '',
    is_login: false,
    links: global_links,
    // user_id: '0',
    user_list: {},
  },
  mutations: {
    updateGlobalArticles(state, payload) {
      state.global_articles = payload;
    },
    updateUserArticles(state, payload) {
      state.user_articles = payload;
    },
    updateUserFollowed(state, payload) {
      state.followed_articles = payload;
    },
    updateProPic(state, payload) {
      state.user.pro_pic = payload;
    },

    /**
     *
     * @param {Object} payload {id, data}
     */
    addArticle(state, payload) {
      state.article_data[payload.id] = payload.data;
    },

    /**
     *
     * @param {Object} payload user
     */
    login(state, payload) {
      state.is_login = true;
      state.user = {
        id: payload.id,
        name: payload.username,
        honor: payload.honor,
        selfIntro: payload.selfIntro,
        pro_pic: payload.proPic,
        nFans: payload.nFans,
        nFollowing: payload.nFollowing,
        nPosts: payload.nPosts,
      };
      state.links = user_links;
      state.links.forEach((link) => {
        if (link.to.params) link.to.params.username = payload.username;
      });
    },
    logout(state) {
      state.is_login = false;
      state.user.name = '';
      state.links = global_links;
    },
    setid(state, payload) {
      state.user.id = payload;
    },
    /**
     *
     * @param {Object} payload { id , info}
     */
    // addUser(state, payload) {
    //   state.user_list[payload.id] = payload.info;
    // },
  },
  getters: {
    // hasFollowed(state, id) {
    // }
  },
  actions: {
    /**
     *
     * @param {Boolean} forceUpdate : forceUpdate or not
     * @returns
     */
    async getGlobalArticles(context, forceUpdate = false) {
      if (context.state.global_articles.length && !forceUpdate) return;
      apiGetArticles()
        .then((res) => {
          context.commit('updateGlobalArticles', res.data);
          res.data.forEach((id) => {
            context.dispatch('getArticle', id);
          });
        })
        .catch((err) => {
          console.log(err);
        });
    },
    async getArticle({ state, commit }, id) {
      if (id in state.article_data) {
        return state.article_data[id];
      }

      return apiGetArticleById(id).then((res) => {
        commit('addArticle', { id, data: res.data });
        return res.data;
      });
    },
    // async getUser({ state, commit }, id) {
    //   if (id in state.user_list) return state.user_list[id];
    //   return await apiGetPublicInfo(id)
    //     .then((res) => {
    //       commit('addUser', { id, info: res.data });
    //       return res.data;
    //     })
    //     .catch((err) => {
    //       console.log(err);
    //     });
    // },

    /**
     *
     * @param {Boolean} forceUpdate
     * @returns
     */
    async getUserArticles(context, forceUpdate = false) {
      if (context.state.user_articles.length && !forceUpdate) return;
      await apiGetUserPosts()
        .then((res) => {
          context.commit('updateUserArticles', res.data);
          res.data.forEach((id) => {
            context.dispatch('getArticle', id);
          });
        })
        .catch((err) => {
          console.log(err);
        });
    },

    /**
     *
     * @param {Object} payload : {username, password}
     *
     */
    async tryLogin(context, payload) {
      return apiTryLogin(payload)
        .then((res) => {
          if(res.status==200){
          apiGetPublicInfo(res.data.id).then((res) => {
            context.commit('login', res.data);
          });
          Vue.$cookies.set('login', payload.username);

          router.push({
            name: 'Articles',
            params: { links: context.state.user_links },
          });
          return;
          }
          else{
            return res;
          }
        })
        .catch((err) => {
          console.log(err);
          return err;
        });
    },

    logout(context) {
      Vue.$cookies.remove('login');
      // console.log(Vue.$cookies.keys());
      apiLogout().then().catch();
      context.commit('logout');
      return;
    },

    async getUserFollowed(context) {
      apiUserFollowedPosts({ username: context.state.user.name })
        .then((res) => {
          context.commit('updateUserFollowed', res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
  modules: {},
});
