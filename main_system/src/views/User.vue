<template lang="pug">
div
  core-app-bar
  v-main.grey.lighten-3
    v-container
      v-row
        v-col(cols="12" sm="2")
          v-sheet(rounded="lg" min-height="268")
            // 
        v-col(cols="12" sm="8")
          router-view/
              
        v-col(cols="12" sm="2")
          v-card.pa-0(rounded="lg" min-height="268" flat)
            v-card-text
              h2 Log In
              v-text-field(placeholder="username")
              v-text-field(placeholder="password")

            v-card-actions.px-4(style="")
              v-row(align="center")
                v-col(cols="12")
                  div.text-center
                    v-btn(width="90%") Submit
                v-col(cols="12")
                  div.text-center
                    router-link(
                      to="/home/register"
                      custom
                      v-slot="{ navigate }"
                    )
                      v-btn(width="90%" @click="navigate") Register

                v-col(cols="12")
                  div.text-center
                    
                      v-btn(width="90%") Log In as Visitor
</template>

<script>

export default {
  name: "User",
  components: {
    CoreAppBar: () => import ('@/components/core/app_bar.vue'),
  }
}
</script>

