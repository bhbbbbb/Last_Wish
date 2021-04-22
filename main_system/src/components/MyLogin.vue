<template lang="pug">
v-card.pa-0(rounded="lg" min-height="268" flat)
  v-card-text
    h2 Log In
    br/
    v-text-field(
      v-model="user.username"
      label="username"
      outlined
      :rules="[rules.empty, rules.regex]"
    )
    v-text-field(
      :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
      :type="show ? 'text' : 'password'"
      @click:append="show = !show"
      label="password"
      v-model="user.password"
      outlined
      :rules="[rules.empty, rules.regex]"
    )

  v-card-actions.px-4(style="")
    v-row(align="center" style="width: 100%")
      v-col(cols="12")
        .text-center
          v-btn(width="90%" @click="Try_Login()") Submit
      v-col(cols="12")
        .text-center
          router-link(
            to="/register"
            custom
            v-slot="{ navigate }"
          )
            v-btn(width="90%" @click="navigate") Register   
      v-col(cols="12")
        .text-center
          v-btn(width="90%" @click="Dev()") Dev log in
</template>

<script>
import { mapActions } from 'vuex';
export default {
  name: "MyLogin",
  data: () => ({
    user: {
      username: "",
      password: "",
    },
    rules: {
      regex: value => {
        const pattern = /^[^\W_]+$/; // allow only word and digit
        return pattern.test(value) || 'contain character except word and digit'
      },
      empty: value => Boolean(value) || "required"
    },
    show: false,
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
      
    },
    
    Dev() {
      this.$store.commit('loginSuccess', "dev");
      this.$router.push({name: "UserArticle", params: {username: "dev"}});
    }
  }
}
</script>
