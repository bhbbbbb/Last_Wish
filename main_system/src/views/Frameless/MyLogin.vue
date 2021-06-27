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
      @click="tryLogin"
      @keydown.enter="tryLogin"
      color="#F4F1EA"
      rounded
      :elevation="0"
    ) log in
  
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
    )
  v-row.mt-3.justify-center(no-gutters)
    v-text-field(
      :append-icon="psw_show ? 'mdi-eye' : 'mdi-eye-off'"
      :type="psw_show ? 'text' : 'password'"
      @click:append="psw_show = !psw_show"
      label="密碼"
      placeholder="密碼"
      v-model="user.password"
      :rules="[rules.empty, rules.regex]"
      @keydown.enter="tryLogin()"
    )

  v-row.mt-3.justify-center.align-center(no-gutters)
    span.caption.main-color 還沒有帳號？
    NavLink.mx-3.caption(to="/register" style="color: #D1AF9B")
      | 點我註冊
  
  MsgBox(:value.sync="show_info" :buttons="1") 
    v-row(no-gutters)
      v-col.d-flex.justify-center(cols="12")
        span {{ info_msg }}
      v-col.d-flex.justify-center.mt-3(cols="12" v-if="unVerified")
        v-btn(text plain outlined @click="Send_mail") 點我重新傳送驗證信
    template(#confirm)
      span {{ cancel_msgs[type] }}

</template>

<script>
import { apiLineLogin, apiSendTokenMail } from '@/store/api.js';
export default {
  name: 'MyLogin',
  components: {
    // Alert: () => import('@/components/Alert'),
    NavLink: () => import('@/components/NavLink'),
    MsgBox: () => import('@/components/MsgBox'),
  },
  data: () => ({
    subtitle: '加入 lernen，幫自己製作屬於自己的學習計劃。',
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
    psw_show: false,
    show_info: false,
    info_msg: '',
    cancel_msgs: {
      try_again: '再試一次',
      cancel: '取消',
      ok: '確定',
    },
    unVerified: false,
    type: 'again',
  }),
  methods: {
    tryLogin() {
      if (!(this.user.username && this.user.password)) {
        // username or pswd is blank
        this.showInfo('帳號或密碼為空');
        return;
      }
      let status = this.rules.regex(this.user.username) === true;
      if (!status) {
        this.showInfo('請檢查使用者名稱');
        return;
      }
      this.$store
        .dispatch('tryLogin', {
          username: this.user.username,
          password: this.user.password,
        })
        .then(() => {
          this.$router.replace('/');
        })
        .catch((e) => {
          this.showInfo(e.response.data.err_msg, 'cancel');
          if (e.response.data.err_code == 3) this.unVerified = true;
          else this.unVerified = false;
        });
    },

    Dev() {
      this.tryLogin({
        username: 'Dev',
        password: '123',
      });
    },

    Line() {
      apiLineLogin({ username: 'haha' })
        .then((res) => {
          console.log(res.status);
          window.open(res.data);
        })
        .catch((err) => {
          this.showInfo('Something went wrong');
          console.log(err);
        });
    },
    Send_mail() {
      if (this.user.username.trim() == '') this.showInfo('Required username');
      else {
        apiSendTokenMail(this.user.username.trim())
          .then((res) => {
            if (res.status == 200) this.showInfo('Email has been sent', 'ok');
          })
          .catch((e) => {
            this.showInfo(e.response.data.err_msg);
          });
      }
    },
    showInfo(info, type = 'try_again') {
      this.info_msg = info;
      this.show_info = true;
      this.type = type;
    },
  },
};
</script>

<style scoped>
.lowercase {
  text-transform: lowercase !important;
}
</style>
