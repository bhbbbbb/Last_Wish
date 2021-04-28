<template lang="pug">
v-app-bar(app flat)
  //- Desktop
  v-tabs.ml-n9(
    v-if="!mobile"
    centered="" color="grey darken-1"
  )
    v-tab(v-for="(link, idx) in links" :key="idx" :to="link.to")
      | {{ link.text }}
  

  //- Desktop
  v-avatar(
    v-if="!mobile"
    color="grey darken-1 shrink" size="32"
  )


  //- mobile
  v-app-bar-nav-icon(
    v-if="mobile"
    @click.stop="drawer = !drawer"
  )
  v-app-bar-title(v-if="mobile") TITLE
  
  v-navigation-drawer(
    app
    v-model="drawer",
    temporary
    hide-overlay
  )
    v-list(nav)
      v-list-item-group(
        v-model="selected"
        mandatory
      )
        v-list-item(
          v-for="(link, idx) in links" :key="link.to.name"
          @click.stop="GoRoute(link)"
          :disabled="idx === selected"
        )
          v-list-item-title  {{ link.text }}

</template>

<script>

export default {
    name: 'CoreAppBar',
    components: {
      NavDrawer: () => import('@/views/User/nav_drawer.vue'),
    },
    props: {
      // login: {
      //   required: true,
      //   type: Boolean
      // },
      links: {
        required: true,
        type: Array
      }
    },
    data: () => ({
        drawer: false,
        selected: 0,
    }),
    methods: {
        GoRoute(link) {
          this.$router.push(link.to);
        }
    }, 

    computed: {
      mobile() {
        return this.$vuetify.breakpoint.mobile;
      },
    },

    mounted() {

    }
}
</script>
