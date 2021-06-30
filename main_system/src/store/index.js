import Vue from 'vue';
import Vuex from 'vuex';
import { apiLogout, apiTryLogin } from './api';
import { global_links, user_links } from '@/data/links.js';
import user from './modules/user';
import article from './modules/article';
import notify from './modules/notify';
Vue.use(Vuex);

export default new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',
  state: {
    is_login: false,
    links: global_links,
  },
  mutations: {
    /**
     *
     * @param {Object} payload user
     */
    login(state, payload) {
      state.is_login = true;
      state.links = user_links;
      state.links.forEach((link) => {
        if (link.to.params) link.to.params.username = payload.username;
      });
    },
    logout(state) {
      state.is_login = false;
      state.links = global_links;
    },
  },
  getters: {},
  actions: {
    /**
     *
     * @param {Object} payload : {username, password}
     *
     */
    async tryLogin(context, payload) {
      let { data } = await apiTryLogin(payload);
      await context.dispatch('login', data.id);
      return;
    },

    async login(context, id) {
      try {
        let data = await context.dispatch('user/getUser', { id });
        context.commit('login', data);
        context.commit('user/setSelfLite', id);
        context.dispatch('notify/refetch');
        context.dispatch('getLikedArticles');
        Vue.$cookies.set('login', id);
      } catch (err) {
        console.error(err);
        throw err;
      }
      return;
    },

    logout(context) {
      Vue.$cookies.remove('login');
      apiLogout();
      context.commit('logout');
      context.commit('user/logout');
      context.commit('cleanFollowedArticles');
      context.commit('cleanArticles');
      return;
    },
  },
  modules: {
    user,
    article,
    notify,
  },
});
