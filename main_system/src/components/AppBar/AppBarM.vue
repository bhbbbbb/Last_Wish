<template lang="pug">
v-app-bar(app flat )

  //- v-app-bar-nav-icon(
  //-   @click.stop="drawer = !drawer"
  //- )
  v-app-bar-title.mx-auto() Last Wish
  
  //- v-navigation-drawer(
  //-   app
  //-   v-model="drawer",
  //-   temporary
  //-   hide-overlay
  //- )
  //-   v-list(nav)
  //-     v-list-item-group(
  //-       v-model="selected"
  //-       mandatory
  //-     )
  //-       v-list-item(
  //-         v-for="link in links" :key="link.to.name"
  //-         :to="link.to"
  //-       )
  //-         v-list-item-avatar
  //-           v-icon {{link.icon ? link.icon : 'mdi-close'}}
  //-         v-list-item-title  {{ link.text }}


</template>

<script>
import {mapState} from 'vuex'
export default {
    name: 'AppBarM',
    components: {
    },
    props: {
      // links: {
      //   required: true,
      //   type: Array
      // },
    },
    data: () => ({
        drawer: false,
        selected: 0,
    }),
    methods: {
        logout() {
          this.$store.dispatch('logout');
          if (this.$route.path !== '/articles') this.$router.push('/articles');
        }
    }, 
    computed: {
      ...mapState(['links']),
      
    },
    
 
}
</script>
