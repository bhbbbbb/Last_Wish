import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import vuetify from './plugins/vuetify';
import VueAxios from 'vue-axios';
import axios from 'axios';
import VueCookies from 'vue-cookies';

Vue.config.productionTip = false;

Vue.use(VueAxios, axios);
Vue.use(VueCookies);

// $cookies.config(expireTimes[,path[, domain[, secure[, sameSite]]])
// secure is set to false for http, (true for https)
Vue.$cookies.config('1d', '/', '', false);

new Vue({
  router,
  store,
  vuetify,
  render: (h) => h(App),
}).$mount('#app');
