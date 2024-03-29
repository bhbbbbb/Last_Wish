import {
  apiAddComment,
  apiDeleteArticle,
  apiEditArticle,
  apiEditComment,
  apiGetArticleById,
  apiGetArticles,
  apiGetFollowedPosts,
  apiGetLikedPost,
  apiGetUserPosts,
  apiSetFinishedArticle,
  apiSetFollow,
  apiSetMsFinished,
  apiUploadArticle,
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
      hot2cold: {
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
      hot2cold: {
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
    cleanSelfArticles(state) {
      console.log(state.self);
      if (state.self)
        state.self.forEach((id) => {
          state.data[id] = undefined;
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

      state.global.hot2cold.finished = undefined;
      state.global.hot2cold.unfinished = undefined;
      state.global.hot2cold.all = undefined;
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

      state.followed.hot2cold.finished = undefined;
      state.followed.hot2cold.unfinished = undefined;
      state.followed.hot2cold.all = undefined;
    },
    // deleteArticle(state, id) {
    //   state.data[id] = false;
    //   let idx = state.self.findIndex((_id) => _id === id);
    //   if (idx !== -1) state.self.splice(idx, 1);

    //   // idx = state.global.findIndex((_id) => _id === id);
    //   // if (idx !== -1) state.global.splice(idx, 1);
    // },

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
      state.data[article_id].content.milestones[insert_idx];
      state.data[article_id].content.milestones.splice(
        insert_idx,
        0,
        milestone
      );
    },
    addComment(state, { article_id, data }) {
      state.data[article_id].comments.push(data);
    },
    editComment(state, { article_id, idx, new_comment, date }) {
      state.data[article_id].comments[idx].body = new_comment;
      state.data[article_id].comments[idx].date = date;
    },
    updateArticleContent(state, { article_id, content }) {
      state.data[article_id].content = content;
    },
    setFollowed(state, { article_id, value, self_id }) {
      let followed_state = state.data[article_id].fans.includes(self_id);

      if (value && !followed_state) state.data[article_id].fans.push(self_id);
      else if (!value && followed_state) {
        let idx = state.data[article_id].fans.findIndex((id) => id === self_id);
        state.data[article_id].fans.splice(idx, 0);
      }
    },
    finishArticle(state, article_id) {
      state.data[article_id].finished = true;
    },
  },
  getters: {
    /**
     *
     * @param {String} type : 'global', 'followed', 'user', 'others'
     * @param {String} sort_by : 'new2old', 'most_liked',
     *     'most_followed','hot2cold'
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
     * @param {String} sort_by : 'new2old', 'most_liked',
     *     'most_followed','hot2cold'
     * @param {String} filter : 'all', 'finished', 'unfinished'
     * @param {String} username : only be true when type = 'others'
     * @param {Boolean} force_update : force_update or not
     * @returns {Promise} Array of id
     */
    async getArticles(
      context,
      { type, sort_by, filter, username, force_update }
    ) {
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
          if (
            !context.rootState.user.others ||
            context.rootState.user.others.name !== username
          ) {
            await context.dispatch('user/getOthersByName', username);
          }
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
     * @param {String} sort_by : 'new2old', 'most_liked',
     *     'most_followed','hot2cold'
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
    async getUserArticles(context, { user_id, sort_by, filter }) {
      if (!sort_by) sort_by = 'new2old';
      if (!filter) filter = 'all';
      return apiGetUserPosts(user_id, sort_by, filter)
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
        .dispatch('getUserArticles', {
          user_id: context.rootState.user.self.id,
          sort_by: 'new2old',
          filter: 'all',
        })
        .then((data) => {
          context.commit('updateSelfArticles', data);
          return data;
        });
    },
    async getOthersArticles(context, { user_id }) {
      return context
        .dispatch('getUserArticles', {
          user_id,
          sort_by: 'new2old',
          filter: 'all',
        })
        .then((data) => {
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
     * @param {String} id article_id
     * @param {Boolean} no_deep if set to true would only get the
     *  article itself (wouldn't fetch citation article)
     * @param {Object} force_update
     * @returns
     */
    async getArticle({ state, commit }, { id, force_update /*, no_deep*/ }) {
      if (!force_update && id in state.data) {
        return state.data[id];
      }

      let { data } = await apiGetArticleById(id);

      commit('updateArticle', { id, data });

      // if (data.citation && !no_deep) {
      //   await dispatch('getArticle', { id: data.citation, no_deep: true
      //   });
      // }
      return data;
    },
    async addArticle(context, { content, citation }) {
      try {
        let { data: new_id } = await apiUploadArticle(content, citation);
        context.dispatch('getArticle', { id: new_id });
        context.commit('cleanArticles');
        return new_id;
      } catch (err) {
        console.error(err);
      }
    },
    deleteArticle(context, id) {
      // context.commit('deleteArticle', id);
      context.commit('cleanArticles');
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
        new_milestones: [milestone],
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
    async addComment(context, { article_id, new_comment }) {
      let data = {
        likes: 0,
        _id: undefined,
        author: context.rootState.user.self.id,
        body: new_comment,
        date: new Date(),
      };
      let new_idx = context.state.data[article_id].comments.length;
      context.commit('addComment', { article_id, data });
      let res = await apiAddComment(article_id, new_comment);
      data._id = res.data.id;
      context.commit('editComment', {
        article_id,
        comment_id: data._id,
        new_comment,
        idx: new_idx,
        date: res.data.newDate,
      });
    },
    async editComment(context, { article_id, comment_id, new_comment, idx }) {
      let { data } = await apiEditComment(article_id, comment_id, new_comment);
      context.commit('editComment', {
        article_id,
        comment_id,
        new_comment,
        idx,
        date: data.date,
      });
    },

    /**
     *
     * @param {String} article_id
     * @param {Object} content : content to suit api form
     * @param {Object} content_native : article.content
     */
    editArticle(context, { article_id, content, content_native }) {
      apiEditArticle(article_id, content);
      context.commit('updateArticleContent', {
        article_id,
        content: content_native,
      });
    },

    async setFollowed(context, { article_id, value }) {
      context.commit('setFollowed', {
        article_id,
        value,
        self_id: context.rootState.user.self.id,
      });
      context.commit('cleanFollowedArticles');
      await apiSetFollow(article_id, value);
      context.dispatch('getArticle', { id: article_id, force_update: true });
    },

    finishArticle(context, { article_id }) {
      context.commit('finishArticle', article_id);
      apiSetFinishedArticle(article_id, true);
    },
  },
};
