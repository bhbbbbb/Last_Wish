<template lang="pug">
v-card.pa-0(rounded="lg" min-height="268" flat)
  v-card-text
    h2 Log In
    v-text-field(placeholder="username" v-model="user.username")
    v-text-field(placeholder="password" v-model="user.password")

  v-card-actions.px-4(style="")
    v-row(align="center")
      v-col(cols="12")
        .text-center
          v-btn(width="90%") Submit
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
          v-btn(width="90%") Log In as Visitor
</template>

<script>
export default {
  name: "MyLogin",
  data: () => ({
    user: {
      username: "",
      password: "",
    }
  }),

}
</script>
