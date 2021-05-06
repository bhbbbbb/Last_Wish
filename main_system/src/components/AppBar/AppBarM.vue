<template lang="pug">
v-app-bar.d-flex.justify-center.align-end.grey.lighten-1(app prominent flat)
  v-container.fill-height(
    style="width:100vw"
  )
    v-row(no-gutters)
      v-col.align-self-center(cols="2")
        v-avatar(@click.stop="Back")
          v-icon(x-large) mdi-chevron-left
      v-col.d-flex.justify-center(cols="8")
        v-app-bar-title
          .text-center()
            h3 願望清單
            span.subtitle wish list

  //- v-app-bar-nav-icon(
  //-   @click.stop="drawer = !drawer"
  //- )
  
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
        Back() {
          this.$router.go(-1);
        }
    }, 
    computed: {
      ...mapState(['links']),
      
    },
    
 
}
</script>
<style scoped>
.subtitle {
  font-size: 1.2rem;
  font-weight: lighter;
  font-family: 'Times New Roman', Times, serif;
  color: white;
  letter-spacing: 0.2rem;
}
.title {
  font-size: 3rem;
}
</style>
