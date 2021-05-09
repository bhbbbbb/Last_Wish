import Vue from 'vue'
import Vuex from 'vuex'
import { apiGetArticles, apiGetPublicInfo, apiLogout, apiTryLogin } from './api';
// import { apiGetArticles } from './api.js'
import router from '@/router/index';
import { global_links, user_links } from './links.js'

Vue.use(Vuex)



export default new Vuex.Store({
  state: {
    articles: '',
    username: '',
    is_login: false,
    links: global_links,
    user_id:'-1',
  },
  mutations: {
    updateData(state, payload) {
      state.articles = payload;
    },
    login(state, payload) {
      state.is_login = true;
      state.username = payload.username;
      state.user_id = (payload.id!=undefined)?payload.id:'-1';
      state.links = user_links;
      state.links.forEach(link => {
        if (link.to.params)
          link.to.params.username = payload;
      });
    },
    logout(state) {
      state.is_login = false;
      state.username = '';
      state.links = global_links;
    }

  },
  getters: {

  },
  actions: {
    async getData(context) {
      if (context.state.articles) return;
      
      await apiGetArticles().then(res => {
        context.commit('updateData', res.data);
      }).catch(err => {
        console.log(err);
      });
    },
    async getArticle(context, id) {
      if (context.state.articles) return context.state.articles[id];
      else {
        await context.dispatch('getData');
        return context.state.articles[id];
      }
    },
    async getUser(context, id) {
      return await apiGetPublicInfo(id).then(res => {
        return res.data;
      }).catch(err => {
        console.log(err);
      });
    },

    tryLogin(context, payload) {
      apiTryLogin(payload).then(() => {

        context.commit('login', payload);

        Vue.$cookies.set('login', payload);

        // router.push({ name: "UserArticle", params: { username: payload.username } });
        router.push({ name: "Articles", params: { links: context.state.user_links } });
        return;

      })
    },

    logout(context) {
      Vue.$cookies.remove('login');
      console.log(Vue.$cookies.keys());
      apiLogout().then().catch();
      context.commit('logout');
      return;
    }
  },
  modules: {
  }
})

