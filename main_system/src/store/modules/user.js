import {
  apiGetPublicInfo,
  apiGetUserId,
  apiGetEvents,
  apiAddEvent,
  apiEditEvent,
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
    event_map: undefined,
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
      state.event_map = new Map();
      let idx = 0;
      data.forEach((event) => {
        state.event_map.set(event._id, idx++);
        event.start = new Date(event.start);
        event.end = new Date(event.end);
      });
      state.events = data;
    },
    addEvent(state, event) {
      state.events.push(event);
    },
    /**
     *
     * @param {Object} { idx, id }
     */
    setEventId(state, { idx, id }) {
      state.events[idx]._id = id;
      if (state.event_map) state.event_map.set(id, idx);
    },
    toggleEventFinish(state, idx) {
      state.events[idx].finished = !state.events[idx].finished;
    },
  },
  getters: {
    getEventById: (state) => (id) => {
      let idx = state.event_map.get(id);
      if (!idx) throw `cannot find event with id ${id}`;
      return state.events[idx];
    },
    is_finished: (state) => (idx) => state.events[idx].finished,
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
      context.commit('addEvent', event);
      let idx = context.state.events.length - 1;
      apiAddEvent(event)
        .then(({ data: id }) => {
          context.commit('setEventId', { idx, id });
        })
        .catch((err) => {
          console.error(err);
        });
    },

    editEvent(context, idx) {
      let edited_event = context.state.events[idx];
      apiEditEvent(edited_event._id, edited_event).catch((err) => {
        console.error(err);
      });
    },
    /**
     *
     * @param {Number} idx (idx of events array)
     */
    toggleEventFinish(context, idx) {
      context.commit('toggleEventFinish', idx);
      context.dispatch('editEvent', idx);
    },
  },
};
