<template lang="pug">
v-app-bar(app flat)

  //- Desktop
  v-tabs.ml-n9(
    v-if="!mobile"
    centered="" color="grey darken-1"
  )
    v-tab(v-for="link in links" :key="link")
      | {{ link }}
  

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
      v-list-item(
        v-for="(link, idx) in links" :key="idx"
        @click.stop=""
      )
        v-list-item-title  {{ link.text }}
</template>

<script>
export default {
    name: 'CoreAppBar',
    components: {
      NavDrawer: () => import('@/views/User/nav_drawer.vue'),
    },
    data: () => ({
        links: [
          {
            text: '世界文章',
            href: '',
          },
          {
            text: '我的追蹤',
            href: '',
          },
          {
            text: '個人頁',
            href: '',
          },
        ],
        drawer: false,

    }),
    methods: {
        Test() {
            console.log(this.$vuetify.breakpoint.xs)
            console.log(this.$vuetify.breakpoint.smOnly)
            console.log(this.$vuetify.breakpoint.mobileBreakpoint)
            console.log("width", this.$vuetify.breakpoint.width)
            console.log("moblie", this.$vuetify.breakpoint.mobile)
        }
    }, 

    computed: {
      mobile() {
        return this.$vuetify.breakpoint.mobile;
      }
    },
}
</script>
