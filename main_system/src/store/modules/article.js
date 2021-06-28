import {
  apiUploadArticle,
  apiGetArticles,
  apiGetArticleById,
  apiGetFollowedPosts,
  apiGetUserPosts,
  apiGetLikedPost,
  apiDeleteArticle,
  apiAddComment,
  apiEditArticle,
  apiSetMsFinished,
  apiSetFollow,
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
    updateArticle(state, payload) {
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

    // clean articles that would affect by upload new article
    cleanArticles(state) {
      state.self = undefined;

      state.global.most_liked.finished = undefined;
      state.global.most_liked.unfinished = undefined;
      state.global.most_liked.all = undefined;

      state.global.most_followed.finished = undefined;
      state.global.most_followed.unfinished = undefined;
      state.global.most_followed.all = undefined;

      state.global.new2old.finished = undefined;
      state.global.new2old.unfinished = undefined;
      state.global.new2old.all = undefined;
    },
    cleanFollowedArticles(state) {
      state.followed.most_liked.finished = undefined;
      state.followed.most_liked.unfinished = undefined;
      state.followed.most_liked.all = undefined;

      state.followed.most_followed.finished = undefined;
      state.followed.most_followed.unfinished = undefined;
      state.followed.most_followed.all = undefined;

      state.followed.new2old.finished = undefined;
      state.followed.new2old.unfinished = undefined;
      state.followed.new2old.all = undefined;
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
    setMilestoneFinished(state, { article_id, ms_idx, value }) {
      state.data[article_id].content.milestones[ms_idx].finished = value;
    },
    addMilestone(state, { article_id, insert_idx, milestone }) {
      state.data[article_id].content.milestones[insert_idx]
      state.data[article_id].content.milestones.splice(insert_idx, 0, milestone);
    },
    addComment(state, { article_id, data }) {
      state.data[article_id].comments.push(data);
    },
    updateArticleContent(state, { article_id, content }) {
      state.data[article_id].content = content;
    },
    setFollowed(state, { article_id, value, self_id }) {
      let followed_state = state.data[article_id].fans.includes(self_id);

      if (value && !followed_state)
        state.data[article_id].fans.push(self_id);

      else if (!value && followed_state) {
        let idx = state.data[article_id].fans.findIndex((id) => id === self_id); 
        state.data[article_id].fans.splice(idx, 0);
      }
    }
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
        commit('updateArticle', { id, data: res.data });
        return res.data;
      });
    },
    async addArticle(context, article_content) {
      try {
        let { data: new_id } = await apiUploadArticle(article_content);
        context.dispatch('getArticle', { id: new_id });
        context.commit('cleanArticles');
        return new_id;
      } catch (err) {
        console.error(err);
      }
    },
    deleteArticle(context, id) {
      context.commit('deleteArticle', id);
      apiDeleteArticle(id).catch((err) => console.error(err));
    },

    /**
     *
     * @param {String} article_id
     * @param {Number} ms_idx
     */
    setMilestoneFinished(context, { article_id, ms_idx, value }) {
      context.commit('setMilestoneFinished', { article_id, ms_idx, value });
      let ms_id = context.state.data[article_id].content.milestones[ms_idx]._id;
      console.log(article_id, ms_id, value);
      apiSetMsFinished(article_id, ms_id, value);
    },

    /**
     * 
     * @param {String} article_id
     * @param {Number} insert_idx 
     * @param {Object} milestone
     */
    addMilestone(context, { article_id, insert_idx, milestone }) {
      let tem = context.state.data[article_id];
      let new_article = {
        title: tem.title,
        body: tem.body,
        tags: tem.tags,
        modified_milestones: [],
        new_milestones: [ milestone ],
        deleted_milestones: [],
      };
      context.commit('addMilestone', { article_id, insert_idx, milestone });
      apiEditArticle(article_id, new_article);
    },

    /**
     *
     * @param {String} article_id
     * @param {String} new_comment
     */
    addComment(context, { article_id, new_comment }) {
      let data = {
        likes: 0,
        _id: undefined,
        author: context.rootState.user.self.id,
        body: new_comment,
        date: new Date(),
      };
      context.commit('addComment', { article_id, data });
      apiAddComment(article_id, new_comment);
    },

    /**
     *
     * @param {String} article_id
     * @param {Object} content : article.content
     */
    editArticle(context, { article_id, content }) {
      apiEditArticle(article_id, content);
      context.commit('updateArticleContent', { article_id, content });
    },

    async setFollowed(context, { article_id, value }) {
      context.commit('setFollowed', { article_id, value, self_id: context.rootState.user.self.id });
      context.commit('cleanFollowedArticles');
      await apiSetFollow(article_id, value);
      context.dispatch('getArticle', { id: article_id, force_update: true });
    },
  },
};
