import Vue from 'vue'
import Vuex from 'vuex'
import { apiGetArticles, apiTryLogin } from './api';
// import { apiGetArticles } from './api.js'
import router from '@/router/index';

Vue.use(Vuex)


export default new Vuex.Store({
  state: {
    articles : [],
    username: "",
    is_login: false,
  },
  mutations: {
    updateData(state, payload) {
      state.articles = payload;
    }, 
    loginSuccess(state, payload) {
      state.is_login = true;
      state.username = payload;
    }
  },
  actions: {
    async getData(context)  {
      apiGetArticles().then(res => {
        context.commit('updateData', res.data);
      }).catch(err => {
        console.log(err);
      });
    },

    tryLogin(context, payload) {
      apiTryLogin(payload).then(res => {
        if (res.data.state === 20) {
          context.commit('loginSuccess', payload.username);
          console.log(res.data);
          router.push({name: "UserArticle", params: {username: payload.username}});
          return res.data;
        }
        console.log(res.data);
        return res.data;
        
      }).catch(err => {
        console.log(err);
      })
    },

    
  },
  modules: {
  }
})
