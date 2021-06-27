import {
  apiGetArticles,
  apiGetArticleById,
  apiGetFollowedPosts,
  apiGetUserPosts,
  apiGetLikedPost,
  apiDeleteArticle,
} from '../api';

export default {
  state: {
    data: {},
    fetching: {},
    global: {
      most_liked: {
        finished: undefined,
        unfinished: undefined,
        all: undefined,
      },
      most_followed: {
        finished: undefined,
        unfinished: undefined,
        all: undefined,
      },
      new2old: {
        finished: undefined,
        unfinished: undefined,
        all: undefined,
      },
    },
    followed: {
      most_liked: {
        finished: undefined,
        unfinished: undefined,
        all: undefined,
      },
      most_followed: {
        finished: undefined,
        unfinished: undefined,
        all: undefined,
      },
      new2old: {
        finished: undefined,
        unfinished: undefined,
        all: undefined,
      },
    },
    self: undefined,
    others: undefined,
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
    updateGlobalArticles(state, { data, sort_by, filter }) {
      state.global[sort_by][filter] = data;
    },
    updateFollowedArticles(state, { data, sort_by, filter }) {
      state.followed[sort_by][filter] = data;
    },
    updateSelfArticles(state, payload) {
      state.self = payload;
    },
    updateOthersArticles(state, payload) {
      state.others = payload;
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
    deleteArticle(state, id) {
      state.data[id] = false;
      let idx = state.self.findIndex((_id) => _id === id);
      if (idx !== -1) state.self.splice(idx, 1);

      idx = state.global.findIndex((_id) => _id === id);
      if (idx !== -1) state.global.splice(idx, 1);
    },

    /**
     *
     * @param {Object} { id, value }
     */
    setLiked(state, { id, value }) {
      state.liked[id] = value;
      state.data[id].likes += value ? 1 : -1;
    },
  },
  getters: {
    /**
     *
     * @param {String} type : 'global', 'followed', 'user', 'others'
     * @param {String} sort_by : 'new2old', 'most_liked', 'most_followed'
     * @param {String} filter : 'all', 'finished', 'unfinished'
     * @returns
     */
    articles: (state) => (type, sort_by, filter) => {
      switch (type) {
        case 'global':
          return state.global[sort_by][filter];

        case 'followed':
          return state.followed[sort_by][filter];

        case 'self':
          return state.self;

        case 'others':
          return state.others;

        default:
          throw `type : ${type} not match any.`;
      }
    },
  },
  actions: {
    /**
     *
     * @param {String} type : 'global', 'followed', 'self', 'others'
     * @param {String} sort_by : 'new2old', 'most_liked', 'most_followed'
     * @param {String} filter : 'all', 'finished', 'unfinished'
     * @param {Boolean} force_update : force_update or not
     * @returns {Promise} Array of id
     */
    async getArticles(context, { type, sort_by, filter, force_update }) {
      switch (type) {
        case 'global':
          return context.dispatch('getGlobalArticles', {
            sort_by,
            filter,
            force_update,
          });

        case 'followed':
          return context.dispatch('getFollowedArticles', {
            sort_by,
            filter,
            force_update,
          });

        case 'self':
          return context.dispatch('getSelfArticles', { force_update });

        case 'others':
          return context.dispatch('getOthersArticles', {
            user_id: context.rootState.user.others.id,
            force_update,
          });

        default:
          throw `type : ${type} not match any.`;
      }
    },
    /**
     *
     * @param {String} sort_by : 'new2old', 'most_liked', 'most_followed'
     * @param {String} filter : 'all', 'finished', 'unfinished'
     * @param {Boolean} force_update : force_update or not
     * @returns
     */
    async getGlobalArticles(context, { sort_by, filter, force_update }) {
      if (!sort_by) sort_by = 'new2old';
      if (!filter) filter = 'all';
      if (context.state.global[sort_by][filter] && !force_update)
        return context.state.global[sort_by][filter];

      try {
        let { data } = await apiGetArticles(sort_by, filter);
        context.commit('updateGlobalArticles', { data, sort_by, filter });
        return data;
      } catch (err) {
        console.error(err);
      }
    },

    async getFollowedArticles(context, { sort_by, filter, force_update }) {
      if (!sort_by) sort_by = 'new2old';
      if (!filter) filter = 'all';

      if (context.state.followed[sort_by][filter] && !force_update)
        return context.state.followed[sort_by][filter];

      try {
        let { data } = await apiGetFollowedPosts(sort_by, filter);
        context.commit('updateFollowedArticles', { data, sort_by, filter });
        return data;
      } catch (err) {
        console.error(err);
      }
    },

    /**
     *
     * @param {String} user_id
     * @returns
     */
    async getUserArticles(context, user_id) {
      return apiGetUserPosts(user_id, 'new2old', 'all')
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          console.log(err);
        });
    },

    /**
     *
     * @param {Boolean} force_update
     * @returns
     */
    async getSelfArticles(context, { force_update }) {
      if (context.state.self && !force_update) return context.state.self;
      return context
        .dispatch('getUserArticles', context.rootState.user.self.id)
        .then((data) => {
          context.commit('updateSelfArticles', data);
          return data;
        });
    },
    async getOthersArticles(context, { user_id }) {
      return context.dispatch('getUserArticles', user_id).then((data) => {
        context.commit('updateOthersArticles', data);
        return data;
      });
    },

    async getLikedArticles(context) {
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

    deleteArticle(context, id) {
      context.commit('deleteArticle', id);
      apiDeleteArticle(id).catch((err) => console.error(err));
    },
  },
};
