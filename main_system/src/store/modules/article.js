import {
  apiGetArticles,
  apiGetArticleById,
  apiGetFollowedPosts,
  apiGetUserPosts,
  apiGetLikedPost,
} from '../api';

export default {
  state: {
    data: {},
    global: [],
    self: [],
    others: [],
    followed: [],
    liked: {},
  },
  mutations: {
    /**
     *
     * @param {Object} payload {id, data}
     */
    addArticle(state, payload) {
      state.data[payload.id] = payload.data;
    },
    updateGlobalArticles(state, payload) {
      state.global = payload;
    },
    updateSelfArticles(state, payload) {
      state.self = payload;
    },
    updateOthersArticles(state, payload) {
      state.others = payload;
    },
    updateUserFollowed(state, payload) {
      state.followed = payload;
    },
    updateLikeArticles(state, payload) {
      payload.forEach((id) => {
        state.liked[id] = true;
      });
    },
    updateSelfArticlesProPic(state, payload) {
      state.self.forEach((id) => {
        state.data[id].author.pro_pic = payload;
      });
    },

    /**
     *
     * @param {Object} { id, value }
     */
    setLiked(state, { id, value }) {
      state.liked[id] = value;
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
     * @param {String} user_id
     * @returns
     */
    async getUserArticles(context, user_id) {
      return await apiGetUserPosts(user_id)
        .then((res) => {
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
    async getSelfArticles(context, forceUpdate = false) {
      if (context.state.self.length && !forceUpdate) return context.state.self;
      await context
        .dispatch('getUserArticles', context.rootState.user.self.id)
        .then((res) => {
          context.commit('updateSelfArticles', res);
          return res;
        });
    },
    async getOthersArticles(context, user_id) {
      return await context.dispatch('getUserArticles', user_id).then((res) => {
        context.commit('updateOthersArticles', res);
        return res;
      });
    },
    async getUserFollowed(context, force_update = false) {
      if (context.state.followed.length !== 0 && !force_update)
        return context.state.followed;
      return apiGetFollowedPosts()
        .then((res) => {
          context.commit('updateUserFollowed', res.data);
          return res.data;
        })
        .catch((err) => {
          console.log(err);
          return [];
        });
    },
    async fetchUserLiked(context) {
      return apiGetLikedPost()
        .then((res) => {
          context.commit('updateLikeArticles', res.data);
          return res.data;
        })
        .catch((err) => {
          console.error(err);
          return [];
        });
    },
  },
};
