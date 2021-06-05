import Vue from 'vue';
import Vuex from 'vuex';
import {
  apiGetArticles,
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
    global_articles: '',
    user_articles: '',
    followed_articles: undefined,
    username: '',
    is_login: false,
    links: global_links,
    user_id: '0',
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

    /**
     *
     * @param {Object} payload {username, id}
     */
    login(state, payload) {
      state.is_login = true;
      state.username = payload.username;
      state.user_id = payload.id;
      state.links = user_links;
      state.links.forEach((link) => {
        if (link.to.params) link.to.params.username = payload;
      });
    },
    logout(state) {
      state.is_login = false;
      state.username = '';
      state.links = global_links;
    },
    setid(state, payload) {
      state.user_id = payload;
    },
    /**
     *
     * @param {Object} payload { id , info}
     */
    add_user(state, payload) {
      state.user_list[payload.id] = payload.info;
    },
  },
  getters: {},
  actions: {
    /**
     *
     * @param {Boolean} forceUpdate : forceUpdate or not
     * @returns
     */
    async getGlobalArticles(context, forceUpdate = false) {
      if (context.state.global_articles && !forceUpdate) return;
      await apiGetArticles()
        .then((res) => {
          context.commit('updateGlobalArticles', res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    async getArticle(context, id) {
      if (context.state.global_articles)
        return context.state.global_articles[id];
      else {
        await context.dispatch('getGlobalArticles');
        return context.state.global_articles[id];
      }
    },
    async getUser({ state, commit }, id) {
      if (id in state.user_list) return state.user_list[id];
      return await apiGetPublicInfo(id)
        .then((res) => {
          commit('add_user', { id, info: res.data });
          return res.data;
        })
        .catch((err) => {
          console.log(err);
        });
    },

    /**
     *
     * @param {Boolean} forceUpdate
     * @returns
     */
    async getUserArticles(context, forceUpdate) {
      if (context.state.user_articles && !forceUpdate) return;
      await apiGetUserPosts({ username: context.state.username })
        .then((res) => {
          context.commit('updateUserArticles', res.data);
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
          context.commit('login', res.data);
          Vue.$cookies.set('login', payload.username);

          router.push({
            name: 'Articles',
            params: { links: context.state.user_links },
          });
          return;
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
      apiUserFollowedPosts({ username: context.state.username })
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
