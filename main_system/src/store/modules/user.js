import { apiGetPublicInfo, apiGetUserId } from '../api';
export default {
  state: {
    data: {},
    self: {
      id: undefined,
      name: undefined,
      pro_pic: undefined,
    },
    // buffer
    others: undefined,
  },
  mutations: {
    updateProPic(state, payload) {
      state.self.pro_pic = payload;
    },
    /**
     *
     * @param {Object} payload { id , info}
     */
    addUser(state, info) {
      state.data[info.id] = {
        id: info.id,
        name: info.username,
        self_intro: info.selfIntro,
        honor: info.honor,
        pro_pic: info.proPic,
        n_fans: info.nFans,
        n_following: info.nFollowing,
        n_posts: info.nPosts,
      };
    },
    /**
     * must be called after commmit addUser(self)
     */
    setSelf(state, id) {
      state.self = state.data[id];
    },

    /**
     * add new user to buffer (others)
     * @param {Object} others
     */
    updateOthers(state, others) {
      state.others = others;
    },
  },
  actions: {
    setSelf({ commit }, payload) {
      commit('addUser', payload);
      commit('setSelf', payload.id); // must be called after addUser
    },
    async getUser({ state, commit }, id) {
      if (id in state.data) return state.data[id];
      return await apiGetPublicInfo(id)
        .then((res) => {
          commit('addUser', res.data);
          return state.data[id];
        })
        .catch((err) => {
          console.error(err);
        });
    },
    async getOthersByName(context, name) {
      let res = await apiGetUserId(name);
      let user = await context.dispatch('getUser', res.data);
      context.commit('updateOthers', user);
      return user;
    },
    updateProPic({ commit }, payload) {
      commit('updateProPic', payload);
      commit('updateSelfArticlesProPic', payload);
    },
  },
};
