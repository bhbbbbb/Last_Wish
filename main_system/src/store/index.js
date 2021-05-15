import Vue from 'vue'
import Vuex from 'vuex'
import { apiGetArticles, apiGetPublicInfo, apiLogout, apiTryLogin, apiUserPosts, apiGetUserId } from './api';
// import { apiGetArticles } from './api.js'
import router from '@/router/index';
import { global_links, user_links } from './links.js'

Vue.use(Vuex)



export default new Vuex.Store({
  state: {
    global_articles: '',
    user_articles: '',
    username: '',
    is_login: false,
    links: global_links,
    user_id:'0',
  },
  mutations: {
    updateGlobalArticles(state, payload) {
      state.global_articles = payload;
    },
    updateUserArticles(state, payload) {
      state.user_articles = payload;
    },
    login(state, payload) {
      state.is_login = true;
      state.username = payload;
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
    },
    setid(state,payload){
      state.user_id = payload;
    }

  },
  getters: {

  },
  actions: {
    async getGlobalArticles(context) {
      if (context.state.global_articles) return;
      await apiGetArticles().then(res => {
        context.commit('updateGlobalArticles', res.data);
      }).catch(err => {
        console.log(err);
      });
    },
    async getArticle(context, id) {
      if (context.state.global_articles) return context.state.global_articles[id];
      else {
        await context.dispatch('getGlobalArticles');
        return context.state.global_articles[id];
      }
    },
    async getUser(context, id) {
      return await apiGetPublicInfo(id).then(res => {
        return res.data;
      }).catch(err => {
        console.log(err);
      });
    },

    async getUserArticles(context) {
      if (context.state.user_articles) return;
      await apiUserPosts({username:context.state.username}).then(res => {
        context.commit('updateUserArticles', res.data);
      }).catch(err => {
        console.log(err);
      })
    },


    /**
     * 
     * @param {Object} payload : {username, password}
     * 
     */
    async tryLogin(context, payload) {
      return apiTryLogin(payload).then(() => {

        context.commit('login', payload.username);

        Vue.$cookies.set('login', payload.username);

        apiGetUserId({name: payload.username})
        .then(res=>{

          context.commit('setid',String(res.data));
        });

        router.push({ name: 'Articles', params: { links: context.state.user_links } });
        return;

      }).catch(err => {
        console.log(err);
        return err;
      })
    },

    logout(context) {
      Vue.$cookies.remove('login');
      // console.log(Vue.$cookies.keys());
      apiLogout().then().catch();
      context.commit('logout');
      return;
    }
  },
  modules: {
  }
})

