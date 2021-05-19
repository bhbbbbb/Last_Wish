<template lang="pug">
v-card.pa-0(rounded="lg" min-height="268" flat="flat")
  v-card-text
    h2 Log In
    br
    v-text-field(v-model="user.username" label="username" outlined="outlined" :rules="[rules.empty, rules.regex]")
    v-text-field(:append-icon="show ? 'mdi-eye' : 'mdi-eye-off'" :type="show ? 'text' : 'password'" @click:append="show = !show" label="password" v-model="user.password" outlined="outlined" :rules="[rules.empty, rules.regex]" @keydown.enter="Try_Login()")
  v-card-actions.px-4
    v-row(align="center" style="width: 100%")
      v-col(cols="12")
        .text-center
          v-btn(width="90%" @click="Try_Login()") Submit
      v-col(cols="12")
        .text-center
          router-link(:to="{name: 'Register'}" custom="custom" v-slot="{ navigate }")
            v-btn(width="90%" @click="navigate") Register   
      v-col(cols="12")
        .text-center
          v-btn(width="90%" @click="Dev()") Dev log in
      //v-col(cols="12")
      //  .text-center
      //    v-btn(width="90%" @click="Line()")
      //      | LINE log in
  v-overlay.align-start(:value="show_info" absolute="absolute" opacity="0")                              
    v-alert.mt-10(:value="show_info" :type="info_type" transition="slide-x-transition") {{infos}}
</template>

<script>
import { mapActions } from 'vuex';
import { apiLineLogin } from '@/store/api.js';
export default {
  name: 'MyLogin',
  data: () => ({
    user: {
      username: '',
      password: '',
      id: '0',
    },
    rules: {
      regex: (value) => {
        const pattern = /^[^\W_]+$/; // allow only word and digit
        return pattern.test(value) || 'contain character except word and digit';
      },
      empty: (value) => Boolean(value) || 'required',
    },
    show: false,
    show_info: false,
    info_type: 'success',
    infos: '',
  }),
  methods: {
    //tryLogin
    ...mapActions(['tryLogin']),

    Try_Login() {
      var status = this.rules.regex(this.user.username) == true;
      if (!(this.user.username && this.user.password)) {
        // username or pswd is blank
        this.Show_info('Empty data', 'error');
        return;
      } else if (!status) this.Show_info('Invalid data', 'error');
      else
        this.tryLogin({
          username: this.user.username,
          password: this.user.password,
        });
    },

    Dev() {
      this.tryLogin({
        username: 'Dev',
        password: '123',
        id: '1',
      });
    },

    Line() {
      apiLineLogin({ username: 'haha' })
        .then((res) => {
          console.log(res.status);
          window.open(res.data);
        })
        .catch((err) => {
          this.Show_info('Something went wrong', 'error');
          console.log(err);
        });
    },
    Show_info(Info, infoType) {
      /**
       *There are 4 types of infoType in default:
       *success
       *info
       *warning
       *error
       */
      this.infos = Info;
      this.info_type = infoType;
      this.show_info = true;
      setTimeout(() => {
        this.show_info = false;
      }, 1000);
    },
  },
};
</script>
