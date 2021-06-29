import { apiGetNotify, apiSetCheckedNotify } from '../api';

export default {
  namespaced: true,
  state: {
    data: undefined,
    unread: undefined,
  },
  mutations: {
    updateData(state, payload) {
      state.data = payload.notifies;
      state.unread = 0;
      state.data.forEach((not) => {
        if (!not.checked) state.unread++;
      });
    },
    check(state, idx) {
      if (!state.data[idx].checked) state.unread--;
      state.data[idx].checked = true;
    },
  },
  actions: {
    async fetch(context, force_update) {
      if (data && !force_update) return data;

      let { data } = await apiGetNotify();
      context.commit('updateData', data);
      return data.notifies;
    },
    check(context, idx) {
      let id = context.state.data[idx].id;
      apiSetCheckedNotify(id, true);
      context.commit('check', idx);
    },
  },
};
