<template lang="pug">
v-app-bar.d-flex.justify-center.align-end(
  app 
  prominent 
  flat
  height="100"
  color='#9ba2aa'
)
  v-container.ma-0.fill-height(
    style="width:100vw;"
  )
    v-row(no-gutters)
      //- v-col.align-self-center(cols="2")
      //-   v-avatar(@click.stop="Back")
      //-     v-icon(large color="white") mdi-chevron-left
      //- v-col.d-flex.justify-center(cols="8")
      //-   v-app-bar-title
      //-     .text-center()
      //-       h3.subtitle 願望清單
      //-       span.subtitle wish list
      v-col.align-self-center(cols="7" offset="1")
        a(href="/")
          v-img(
            src="@/assets/appbar_logo_3.png"
            height="29"
            width="108"
            max-height="50"
            contain
          )
      

      //- #calendar
      v-col.align-self-center(cols="2")
        v-btn.ma-0.pa-1(
          v-if="$store.state.is_login"
          width="64"
          height="64"
          text
          link
          :to="{ name: 'Calendar' }"
        )
          .d-flex.flex-column.align-center
            v-icon(large color="white") mdi-calendar-range
            span.caption(style="color: white;") 行事曆
        
      //- #notify
      v-col.align-self-center(cols="2")
        Notification

  //- v-app-bar-nav-icon(
//- 
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
import { mapState } from 'vuex';
export default {
  name: 'AppBarM',
  components: {
    Notification: () => import('@/components/Notification'),
    NavLink: () => import('@/components/NavLink'),
  },
  props: {},
  data: () => ({
    drawer: false,
    selected: 0,
  }),
  computed: {
    ...mapState(['links']),
  },
  created() {},
  methods: {
    Back() {
      this.$router.go(-1);
    },
    goCalendar() {
      this.$router.push({ name: 'Calendar' });
    },
  },
};
</script>
<style scoped>
.subtitle {
  font-size: 1.2rem;
  font-weight: lighter;
  color: white;
  letter-spacing: 0.2rem;
  height: 30px;
}
.title {
  font-size: 3rem;
}
h3.subtitle {
  font-size: 1.6rem;
}
.v-btn__content {
  display: flex;
  flex-direction: column;
}
</style>
