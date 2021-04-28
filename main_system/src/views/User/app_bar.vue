<template lang="pug">
v-app-bar(app="" color="white" flat="")
  //- v-avatar(
  //-   :color="$vuetify.breakpoint.mobile ? 'grey darken-1' : 'transparent'" 
  //-   size="32"
  //- )
  v-app-bar-nav-icon(
    @click="Test()"
  )

  v-tabs.ml-n9(
    v-if="! $vuetify.breakpoint.moblie"
    centered="" color="grey darken-1"
  )
    v-tab(v-for="link in links" :key="link")
      | {{ link }}
  v-avatar(
    v-if="! $vuetify.breakpoint.moblie"
    color="grey darken-1 shrink" size="32"
  )

  v-navigation-drawer(
    :value="drawer",
    nav
  )
    v-list-item
      v-list-item-title  shit
</template>

<script>
export default {
    name: 'CoreAppBar',
    data: () => ({
        links: [
            'Dashboard',
            'Messages',
            'Profile',
            'Updates',
        ],
        drawer: false,
    }),
    methods: {
        Test() {
            console.log(this.$vuetify.breakpoint.xs)
            console.log(this.$vuetify.breakpoint.smOnly)
            console.log(this.$vuetify.breakpoint.mobileBreakpoint)
            console.log(this.$vuetify.breakpoint.width)
            console.log(this.$vuetify.breakpoint.mobile)
        }
    }
}
</script>
