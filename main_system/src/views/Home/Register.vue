<template lang="pug">
v-card(min-height="70vh" rounded="lg" flat)
    v-card-title.justify-center {{ Title }}
    v-card-text.justify-center
      h2 your user name
      v-text-field(
          v-model="user.username"
          label=""
          :rules="[rules.empty, rules.regex]"
      )
      br/
      h2 your password
      v-text-field(
          v-model.lazy="user.password"
          label=""
          type="password"
          :rules="[rules.empty, rules.regex]"
      )
      br/
      h2 confirm your password
      v-text-field(
          v-model.lazy="user.password_confirm"
          label=""
          type="password"
          :rules="[rules.empty, rules.regex, rules.confirm_match]"
      )
      
      v-card-actions.justify-center
        v-btn(@click="UplooadRegiser()") confirm
      

    v-overlay.align-start(
    :value="show_info"
    absolute
    opacity="0"
  )                              
    v-alert.mt-10(:value="show_info" :type="info_type" transition="slide-x-transition") {{reg_info}}



</template>

<script>
import {apiRegister} from '@/store/api';

export default {
  name: 'Register',
  data: () => ({
    Title: 'this is a register page',
    show_info: false,
    reg_info: '',
    info_type: 'success',
    user: {
      username: '',
      password: '',
      password_confirm: '',
    },
    rules: {
      regex: (value) => {
        const pattern = /^[^\W_]+$/; // allow only word and digit
        return pattern.test(value) || 'contain character except word and digit';
      },
      empty: (value) => Boolean(value) || 'required',
      confirm_match: () => null,
    },
  }),
  created() {
    this.rules.confirm_match = (value) =>
      value === this.user.password || 'password not matched';
  },
  methods: {
    UplooadRegiser() {
      var status =
        this.rules.confirm_match(this.user.password_confirm) == true &&
        this.rules.regex(this.user.username) == true;
      if (status) {
        apiRegister(this.user)
          .then((res) => {
            if (res.status == 200)
              this.Show_info('Success registered', 'success');
            else this.Show_info(res.data.err_msg, 'error');
          })
          .catch((err) => {
            console.log(err);
          });
      } else this.Show_info('Incorrect Register data', 'error');
    },
    Show_info(Info, infoType) {
      /**
       *There are 4 types of infoType in default:
       *success
       *info
       *warning
       *error
       */
      this.reg_info = Info;
      this.info_type = infoType;
      this.show_info = true;
      setTimeout(() => {
        this.show_info = false;
      }, 1000);
    },
  },
};
</script>

<style scoped lang=""></style>
