import { apiGetPublicInfo } from '../api';
export default {
  state: {
    data: {},
    self: {
      id: undefined,
      name: undefined,
      pro_pic: undefined,
    },
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
          return res.data;
        })
        .catch((err) => {
          console.error(err);
        });
    },
  },
};
