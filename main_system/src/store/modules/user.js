import {
  apiGetPublicInfo,
  apiGetUserId,
  apiGetEvents,
  apiAddEvent,
  apiEditEvent,
  apiSetSelfIntro,
  apiSetFinishedEvent,
  apiGetHomePageInfo,
  apiIsValid,
} from '../api';
const MORE = 2,
  LITE = 1;
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
    name_list: {},
  },
  mutations: {
    updateIntro(state, payload) {
      state.self.self_intro = payload;
    },

    updateProPic(state, payload) {
      state.self.pro_pic = payload;
      state.data[state.self.id].pro_pic = payload;
    },

    setSelfLite(state, id) {
      state.self = state.data[id];
    },
    /**
     *
     * @param {Object} payload { id , info}
     */
    updateUserLite(state, info) {
      state.data[info.id] = {
        id: info.id,
        name: info.username,
        pro_pic: info.pro_pic,
        // self_intro: info.self_intro,
        // honor: info.honor,
        // n_fans: info.nFans,
        // n_following: info.nFollowing,
        // n_posts: info.nPosts,
      };
    },

    updateHomePageInfo(state, info) {
      state.data[info.id] = {
        id: info.id,
        name: info.username,
        pro_pic: info.pro_pic,
        self_intro: info.self_intro,
        lv: info.lv,
        score: info.score,
        honor: info.honor,
        n_posts: info.n_posts,
        n_cited: info.n_cited,
        n_liked: info.n_liked,
        n_finished: info.n_finished,
      };
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
     * @param {Object} { id, promise, more }
     */
    startFetching(state, { id, promise, more }) {
      if (more) state.fetching[id] = MORE;
      else state.fetching[id] = LITE;
      state.data[id] = promise;
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
    editEventName(state, { idx, name }) {
      state.events[idx].name = name;
    },
    repickEventTime(state, { idx, start, end, color }) {
      state.events[idx].start = start;
      state.events[idx].end = end;
      state.events[idx].color = color;
    },
    updateNameList(state, { name, result }) {
      state.name_list[name] = result;
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
    async getSelfMore(context) {
      return context.dispatch('getUser', {
        id: context.state.self.id,
        more: true,
      });
    },
    async getUser({ state, commit, dispatch }, { id, more, force_update }) {
      if (!force_update) {
        if (id in state.data && (!more || state.data[id].lv))
          return state.data[id];

        if (
          state.fetching[id] === MORE ||
          (state.fetching[id] === LITE && !more)
        )
          return state.data[id];
      }

      let res;
      if (!more)
        res = apiGetPublicInfo(id)
          .then((res) => {
            commit('updateUserLite', res.data);
            commit('endFetching', id);
            return state.data[id];
          })
          .catch((err) => {
            console.error(err);
          });
      else
        res = dispatch('getHomePageInfo', id).then(() => {
          commit('endFetching', id);
          return state.data[id];
        });

      commit('startFetching', { id, promise: res, more });

      return res;
    },
    async getHomePageInfo(context, id) {
      let { data } = await apiGetHomePageInfo(id);
      context.commit('updateHomePageInfo', data);
    },
    async getOthersByName(context, name) {
      let res = await apiGetUserId(name);
      let user = await context.dispatch('getUser', {
        id: res.data,
        more: true,
      });
      context.commit('updateOthers', user);
      return user;
    },
    updateProPic({ commit }, payload) {
      commit('updateProPic', payload);
      // commit('cleanSelfArticles', null, { root: true });
    },
    updateIntro({ commit }, payload) {
      apiSetSelfIntro({ self_intro: payload });
      commit('updateIntro', payload);
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

    editEventName(context, { idx, name }) {
      context.commit('editEventName', { idx, name });
      context.dispatch('editEvent', idx);
    },
    repickEventTime(context, { idx, start, end, color }) {
      context.commit('repickEventTime', { idx, start, end, color });
      context.dispatch('editEvent', idx);
    },
    /**
     *
     * @param {Number} idx (idx of events array)
     */
    toggleEventFinish(context, idx) {
      context.commit('toggleEventFinish', idx);
      let value = context.state.events[idx].finished;
      let event_id = context.state.events[idx]._id;
      apiSetFinishedEvent(event_id, value);
    },

    async nameExisted(context, name) {
      if (name in context.state.name_list) return context.state.name_list[name];

      let res = apiIsValid(name).then(({ data }) => !data);
      context.commit('updateNameList', { name, result: res });
      return res;
    },
  },
};
