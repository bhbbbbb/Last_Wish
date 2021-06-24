import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import vuetify from './plugins/vuetify';
import VueAxios from 'vue-axios';
import axios from 'axios';
import VueCookies from 'vue-cookies';
import './registerServiceWorker';
import '@/assets/main.scss';

Vue.config.productionTip = false;

Vue.use(VueAxios, axios);
Vue.use(VueCookies);

// $cookies.config(expireTimes[,path[, domain[, secure[, sameSite]]])
// secure is set to false for http, (true for https)
Vue.$cookies.config('1m', '/', '', process.env.NODE_ENV !== 'development');

new Vue({
  router,
  store,
  vuetify,
  render: (h) => h(App),
}).$mount('#app');
