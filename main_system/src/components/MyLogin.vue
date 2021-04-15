<template lang="pug">
v-card.pa-0(rounded="lg" min-height="268" flat)
  v-card-text
    h2 Log In
    v-text-field(placeholder="username" v-model="user.username")
    v-text-field(placeholder="password" v-model="user.password")

  v-card-actions.px-4(style="")
    v-row(align="center" style="width: 100%")
      v-col(cols="12")
        .text-center
          v-btn(width="90%" @click="Try_Login()") Submit
      v-col(cols="12")
        .text-center
          router-link(
            to="/home/register"
            custom
            v-slot="{ navigate }"
          )
            v-btn(width="90%" @click="navigate") Register   
      v-col(cols="12")
        .text-center
          v-btn(width="90%" @click="Visitor()") Log In as Visitor
</template>

<script>
import { mapActions } from 'vuex';
export default {
  name: "MyLogin",
  data: () => ({
    user: {
      username: "",
      password: "",
    }
  }),
  methods: {
    //tryLogin
    ...mapActions(['tryLogin']),
    Try_Login() {
      if (! (this.user.username && this.user.password)) {
        // username or pswd is blank
        // todo show error
        return;
      }
      this.tryLogin(this.user);
      // console.log(this.$store);
      // this.test();
      // this.$store.dispatch('tryLogin', this.user);
    },
    Visitor() {
      this.tryLogin({
        username: "visitor",
        password: "",
      })
    }
  }
}
</script>
