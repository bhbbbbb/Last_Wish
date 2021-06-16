import Vue from 'vue';
import Vuex from 'vuex';
import { apiGetPublicInfo, apiLogout, apiTryLogin } from './api';
import router from '@/router/index';
import { global_links, user_links } from '@/data/links.js';
import user from './modules/user';
import article from './modules/article';
Vue.use(Vuex);

export default new Vuex.Store({
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
      return apiTryLogin(payload)
        .then((res) => {
          if (res.status == 200) {
            apiGetPublicInfo(res.data.id).then((res) => {
              context.commit('login', res.data);
              context.dispatch('setSelf', res.data);
            });
            Vue.$cookies.set('login', payload.username);

            router.push({
              name: 'Articles',
              params: { links: context.state.user_links },
            });
            return;
          } else {
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
  },
  modules: {
    user,
    article,
  },
});
