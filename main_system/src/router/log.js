import Vue from 'vue';
import store from '@/store/index';
import { apiWho } from '@/store/api';
//import Vuex from 'vuex'

/*********
 * check whether the user is login when there is some access to user router
 * @param { Object } to
 * @returns { Boolean }
 */
export const isLogin = async () => {
  if (store.state.is_login) {
    return true;
  } else if (Vue.$cookies.isKey('login')) {
    let cookies_login = Vue.$cookies.get('login');
    if (cookies_login) {
      try {
        let who = await apiWho().then((res) => res.data);
        if (String(cookies_login) === String(who.username)) {
          store.commit('login', who);
          return true;
        }
      } catch (err) {
        console.log(err);
        return false;
      }
    }
  }

  // console.log('you are so bad');
  return false;
};
