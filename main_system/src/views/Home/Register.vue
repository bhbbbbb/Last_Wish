<template lang="pug">
v-card(min-height="70vh" rounded="lg" flat)
  v-card-title.justify-center {{ Title }}
  v-card-text.justify-center
    h2 your user name
    v-text-field(
      v-model="user.username"
      label=""
      :rules="[rules.empty, rules.regex]"
      autocomplete="off"
      @blur="checkValid"
      :error-messages="valid_message"
    )
    br/
    h2 your password
    v-text-field(
      v-model.lazy="user.password"
      label=""
      type="password"
      :rules="[rules.empty, rules.regex]"
      autocomplete="off"
    )
    br/
    h2 confirm your password
    v-text-field(
      v-model.lazy="user.password_confirm"
      label=""
      type="password"
      :rules="[rules.empty, rules.regex, rules.confirm_match]"
      autocomplete="off"
    )

    v-card-actions.justify-center
      v-btn(@click="UplooadRegiser()") confirm

  v-overlay.align-start(
    :value="show_info"
    absolute
    opacity="0"
  )                              
    v-alert.mt-10(:value="show_info" :type="info_type" transition="slide-x-transition") {{infos}}

</template>

<script>
import { apiRegister, apiIsValid } from '@/store/api';

export default {
  name: 'Register',
  data: () => ({
    Title: 'this is a register page',
    show_info: false,
    infos: '',
    info_type: 'success',
    valid_message: undefined,
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
            if (res.status == 200) {
              this.$store.dispatch('tryLogin', {
                username: this.user.username,
                password: this.user.password,
              });
              this.Show_info('Success registered', 'success');
            } else this.Show_info(res.data.err_msg, 'error');
          })
          .catch((err) => {
            console.log(err);
          });
      } else this.Show_info('Incorrect Register data', 'error');
    },
    checkValid() {
      this.valid_message = 'error';
      if (this.user.username)
        apiIsValid(this.user.username).then((res) => {
          console.log(res.data);
          if (!res.data.isValid) this.valid_message = '使用者以重複';
          else this.valid_message = 'OK';
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

<style scoped lang=""></style>
