import {
  apiGetArticles,
  apiGetArticleById,
  apiGetUserPosts,
  apiGetFollowedPosts,
} from '../api';

export default {
  state: {
    data: {},
    global: [],
    user: [],
    followed: [],
  },
  mutations: {
    updateGlobalArticles(state, payload) {
      state.global = payload;
    },
    updateUserArticles(state, payload) {
      state.user = payload;
    },
    updateUserFollowed(state, payload) {
      state.followed = payload;
    },
  },
  actions: {
    /**
     *
     * @param {Boolean} forceUpdate : forceUpdate or not
     * @returns
     */
    async getGlobalArticles(context, forceUpdate = false) {
      if (context.state.global.length && !forceUpdate) return;
      apiGetArticles()
        .then((res) => {
          context.commit('updateGlobalArticles', res.data);
          res.data.forEach((id) => {
            context.dispatch('getArticle', { id });
          });
        })
        .catch((err) => {
          console.log(err);
        });
    },

    /**
     *
     * @param {Object} payload { id, force_update = false }
     * @returns
     */
    async getArticle({ state, commit }, { id, force_update }) {
      if (!force_update && id in state.data) {
        return state.data[id];
      }

      return apiGetArticleById(id).then((res) => {
        commit('addArticle', { id, data: res.data });
        return res.data;
      });
    },

    /**
     *
     * @param {Boolean} forceUpdate
     * @returns
     */
    async getUserArticles(context, forceUpdate = false) {
      if (context.rootState.user.length && !forceUpdate) return;
      await apiGetUserPosts(context.rootState.user.self.id)
        .then((res) => {
          context.commit('updateUserArticles', res.data);
          res.data.forEach((id) => {
            context.dispatch('getArticle', { id });
          });
        })
        .catch((err) => {
          console.log(err);
        });
    },
    async getUserFollowed(context, force_update = false) {
      if (context.state.followed.length !== 0 && !force_update)
        return context.state.followed;
      return apiGetFollowedPosts()
        .then((res) => {
          context.commit('updateUserFollowed', res.data);
          res.data.forEach((id) => {
            context.dispatch('getArticle', { id });
          });
          return res.data;
        })
        .catch((err) => {
          console.log(err);
          return [];
        });
    },
  },
};
