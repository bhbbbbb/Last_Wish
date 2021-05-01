import Vue from 'vue'
import Vuex from 'vuex'
import { apiGetArticles, apiLogout, apiTryLogin } from './api';
// import { apiGetArticles } from './api.js'
import router from '@/router/index';
import { global_links, user_links } from './links.js'

Vue.use(Vuex)



export default new Vuex.Store({
  state: {
    articles: [],
    username: "",
    is_login: false,
    global_links,
    user_links,

  },
  mutations: {
    updateData(state, payload) {
      state.articles = payload;
    },
    login(state, payload) {
      state.is_login = true;
      state.username = payload;
    },
    logout(state) {
      state.is_login = false;
      state.username = '';
    }

  },
  actions: {
    async getData(context) {
      apiGetArticles().then(res => {
        context.commit('updateData', res.data);
      }).catch(err => {
        console.log(err);
      });
    },

    tryLogin(context, payload) {
      apiTryLogin(payload).then(() => {

        context.commit('login', payload.username);

        Vue.$cookies.set('login', payload.username);

        router.push({ name: "UserArticle", params: { username: payload.username } });
        return;

      }).catch(err => {
        console.log(err);
      })
    },

    logout(context) {
      Vue.$cookies.remove('login');
      apiLogout().then().catch();
      context.commit('logout');
      router.push('/');
      return;
    }
  },
  modules: {
  }
})

