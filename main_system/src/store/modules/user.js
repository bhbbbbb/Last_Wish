import {
  apiGetPublicInfo,
  apiGetUserId,
  apiGetEvents,
  apiAddEvent,
} from '../api';
export default {
  namespaced: true,
  state: {
    data: {},
    fetching: {},
    self: {
      id: undefined,
      name: undefined,
      pro_pic: undefined,
    },
    // buffer
    others: undefined,
    events: [],
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

    /**
     *
     * @param {Object} { id, promise }
     */
    startFetching(state, { id, promise }) {
      state.fetching[id] = promise;
    },

    /**
     *
     * @param {String} id
     */
    endFetching(state, id) {
      state.fetching[id] = undefined;
    },

    updateEvents(state, data) {
      data.forEach((event) => {
        event.start = new Date(event.start);
        event.end = new Date(event.end);
      });
      state.events = data;
    },
    addEvent(state, event) {
      state.events.push(event);
    },
  },
  actions: {
    setSelf({ commit }, payload) {
      commit('addUser', payload);
      commit('setSelf', payload.id); // must be called after addUser
    },
    async getUser({ state, commit }, id) {
      if (id in state.data) return state.data[id];

      if (state.fetching[id]) return state.fetching[id];

      let res = apiGetPublicInfo(id)
        .then((res) => {
          commit('addUser', res.data);
          commit('endFetching', id);
          return state.data[id];
        })
        .catch((err) => {
          console.error(err);
        });

      commit('startFetching', { id, promise: res });
      return res;
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

    async getEvents(context, force_update) {
      if (context.state.events.length && !force_update)
        return context.state.events;

      try {
        let { data } = await apiGetEvents();
        context.commit('updateEvents', data);
        return context.state.events;
      } catch (err) {
        console.error(err);
      }
    },
    /**
     *
     * @param {Obj} event
     */
    async addEvent(context, event) {
      apiAddEvent(event).catch((err) => {
        console.error(err);
      });
      context.commit('addEvent', event);
    },
  },
};
