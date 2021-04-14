import Vue from 'vue'
import Vuex from 'vuex'
import { apiGetArticles } from './api';
// import { apiGetArticles } from './api.js'


Vue.use(Vuex)


export default new Vuex.Store({
  state: {
    articles : [],
  },
  mutations: {
    updateData(state, payload) {
      state.articles = payload;
    }
  },
  actions: {
    async getData(context)  {
      apiGetArticles().then(res => {
        context.commit('updateData', res.data);
      }).catch(err => {
        console.log(err);
      });
    }
  },
  modules: {
  }
})
