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
        v-btn confirm
      
</template>

<script>
export default {
    name: 'Register',
    data: () => ({
        Title: "this is a register page",
        user: {
            username: "",
            password: "",
            password_confirm: "",
        },
        rules: {
            regex: value => {
                const pattern = /^[^\W_]+$/; // allow only word and digit
                return pattern.test(value) || 'contain character except word and digit'
            },
            empty: value => Boolean(value) || "required",
            confirm_match: ()=> null,
        }
    }),
    methods: {

    },
    created() {
      this.rules.confirm_match = value => value === this.user.password || "password not matched";
    }

}
</script>

<style scoped lang="">

</style>
