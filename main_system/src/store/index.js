import Vue from 'vue'
import Vuex from 'vuex'
// import { apiGetArticles } from './api.js'


Vue.use(Vuex)


export default new Vuex.Store({
  state: {
    articles : ""
  },
  mutations: {
  },
  actions: {
    // async getArticles()  {
    //   try {
    //     const articles = await apiGetArticles();
    //     return articles
    //   } catch(err) {
    //     console.log(err);
    //   }
    // }
  },
  modules: {
  }
})
