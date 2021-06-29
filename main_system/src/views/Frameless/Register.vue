<template lang="pug">
v-card.ma-0.pa-2(flat min-height="400" min-width="300")
  v-row.mb-4(no-gutters)
    v-img(
      src="@/assets/logo_dark.png"
      width="160"
      height="44"
      contain
    )
  v-row.justify-center(no-gutters)
    span.main-color(style="width: 160px; white-space: wrap;") {{ subtitle }}
  

  //- #login #btn
  v-row.justify-center.mt-10(no-gutters)
    v-btn.lowercase(
      width="132"
      height="24"
      @click="UploadRegister"
      @keydown.enter="UploadRegister"
      color="#F4F1EA"
      rounded
      :elevation="0"
    ) Register
  
  //- #dev
  //- v-row.mt-3.justify-center(no-gutters)
  //-   v-btn(
  //-     width="132"
  //-     height="24"
  //-     @click="Dev()"
  //-     color="#F4F1EA"
  //-     rounded
  //-     :elevation="0"
  //-   ) Dev log
        
  v-row.mt-3.justify-center(no-gutters)
    v-text-field(
      v-model="user.username"
      label="帳號"
      placeholder="帳號"
      :rules="[rules.empty, rules.regex]"
      @blur='checkValid',
      :success-messages = 'valid_message'
      :error-messages='invalid_message'
      @input="flushResult"
    )
  v-row.mt-3.justify-center(no-gutters)
    v-text-field(
      :append-icon="psw_show ? 'mdi-eye' : 'mdi-eye-off'"
      :type="psw_show ? 'text' : 'password'"
      @click:append="psw_show = !psw_show"
      label="密碼"
      placeholder="密碼"
      v-model="user.password"
      :rules='[rules.empty, rules.regex]',
    )
  v-row.mt-3.justify-center(no-gutters)
    v-text-field(
      :append-icon="psw_show2 ? 'mdi-eye' : 'mdi-eye-off'"
      :type="psw_show2 ? 'text' : 'password'"
      @click:append="psw_show2 = !psw_show2"
      label="確認密碼"
      placeholder="確認密碼"
      v-model="user.password_confirm"
      :rules='[rules.empty, rules.regex, rules.confirm_match]',
    )
  v-row.mt-3.justify-center(no-gutters)
    v-text-field(
      label="信箱"
      placeholder="信箱"
      v-model="user.email"
      :rules="[rules.empty, rules.email]"
    )
  
  MsgBox(:value.sync="show_info" :buttons="1") 
    v-row(no-gutters)
      v-col.d-flex.justify-center(cols="12")
        span {{ info_msg }}
    template(#confirm)
      span  確認 
</template>

<script>
import { apiRegister, apiIsValid } from '@/store/api';

export default {
  name: 'Register',
  components: {
    MsgBox: () => import('@/components/MsgBox'),
  },
  data: () => ({
    subtitle: '加入 lernen，幫自己製作屬於自己的學習計劃。',
    show_info: false,
    psw_show: false,
    psw_show2: false,
    info_msg: '',
    valid_message: undefined,
    invalid_message: undefined,
    user: {
      username: '',
      password: '',
      password_confirm: '',
      email: '',
    },
    rules: {
      regex: (value) => {
        const pattern = /^[^\W_]+$/; // allow only word and digit
        return pattern.test(value) || 'contain character except word and digit';
      },
      empty: (value) => Boolean(value) || 'required',
      confirm_match: () => null,
      email: (v) => /.+@.+\..+/.test(v) || 'E-mail must be valid',
    },
  }),
  created() {
    this.rules.confirm_match = (value) =>
      value === this.user.password || 'password not matched';
  },
  methods: {
    UploadRegister() {
      var status =
        this.rules.confirm_match(this.user.password_confirm) == true &&
        this.rules.regex(this.user.username) == true;
      if (status) {
        apiRegister(this.user)
          .then((res) => {
            if (res.status == 200) {
              //this.$store.dispatch('tryLogin', {
              //  username: this.user.username,
              //  password: this.user.password,
              //});
              this.showInfo(
                'Success registered\nPlease check your email box',
                'success'
              );
            }
          })
          .catch((err) => {
            this.showInfo(err.response.data.err_msg, 'error');
            console.log(err);
          });
      } else this.showInfo('Incorrect Register data', 'error');
    },
    checkValid() {
      if (this.user.username)
        apiIsValid(this.user.username).then((res) => {
          if (!res.data) {
            this.invalid_message = '使用者已重複';
            this.valid_message = '';
          } else {
            this.valid_message = 'OK';
            this.invalid_message = '';
          }
        });
    },
    showInfo(info, type = 'try_again') {
      this.info_msg = info;
      this.show_info = true;
      this.type = type;
    },
    flushResult() {
      this.valid_message = '';
      this.invalid_message = '';
    },
  },
};
</script>

<style>
.multi-line {
  white-space: pre-line;
}
</style>
