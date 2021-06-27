<template lang="pug">
v-card(min-height="70vh", rounded="lg", flat)
  v-card-text.justify-center
    h2 your user name
    v-text-field(
      v-model="user.username",
      :rules="[rules.empty, rules.regex]",
      autocomplete="off",
      @blur="checkValid",
      :error-messages="valid_message"
			:disabled="$store.state.is_login"
    )
    br/
    h2 your new password
    v-text-field(
      v-model.lazy="user.password",
      type="password",
      :rules="[rules.empty, rules.regex]",
      autocomplete="off"
    )
    br/
    h2 confirm your password
    v-text-field(
      v-model.lazy="user.password_confirm",
      label="",
      type="password",
      :rules="[rules.empty, rules.regex, rules.confirm_match]",
      autocomplete="off"
    )

    v-card-actions.justify-center
      v-btn(@click="submit") confirm

  v-overlay.align-start(:value="show_info", absolute, opacity="0") 
    v-alert.mt-10(
      :value="show_info",
      :type="info_type",
      class="multi-line",
      transition="slide-x-transition"
    ) {{ infos }}
</template>

<script>
import { apiIsValid, apiReset } from '@/store/api';

export default {
  name: 'Register',
  data: () => ({
    show_info: false,
    infos: '',
    info_type: 'success',
    valid_message: undefined,
    user: {
      username: '',
      password: '',
      password_confirm: '',
      email: '',
    },
    emailRules: [
      (v) => !!v || 'E-mail is required',
      (v) => /.+@.+\..+/.test(v) || 'E-mail must be valid',
    ],
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
    if (this.$store.state.is_login)
      this.user.username = this.$store.state.user.self.name;
    this.rules.confirm_match = (value) =>
      value === this.user.password || 'password not matched';
  },
  methods: {
    checkValid() {
      if (!this.$store.state.is_login && this.user.username)
        apiIsValid(this.user.username).then((res) => {
          console.log(res.data);
          if (!res.data.isValid) this.valid_message = '使用者不存在';
          else this.valid_message = 'OK';
        });
    },
    async submit() {
      await apiReset(this.user.username, this.user.password);
    },
    Show_info(Info, infoType) {
      /**
       *There are 4 types of infoType in default:
       *success
       *info
       *warning
       *error
       */
      console.log(Info);
      this.infos = Info;
      this.info_type = infoType;
      this.show_info = true;
      setTimeout(() => {
        this.show_info = false;
      }, 1500);
    },
  },
};
</script>

<style scoped>
.multi-line {
  white-space: pre-line;
}
</style>
