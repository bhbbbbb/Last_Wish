<template lang="pug">
v-app-bar(
  app
  flat
  prominent
  color="#CED3CD"
  height="180"
  extension-height="50"
)
  v-sheet.pa-0.px-0.ma-0(style="width: 100vw" color="transparent")
    v-row.align-self-start(no-gutters)
      v-col(cols="6")
        v-icon(@click.stop="Back") mdi-chevron-left
      v-col.d-flex.justify-end.pr-0(cols="6")
        v-menu(offset-y)
          template(#activator="{ on, attrs }")
            v-btn(
              icon
              v-bind="attrs"
              v-on="on"
            ) 
              v-icon mdi-cog
          v-list
            v-list-item
              v-list-item-title 設定自介
            v-list-item(@click="logout")
              v-list-item-title 登出
    v-row.px-3.align-center.align-start(no-gutters)
      v-col(cols="3")
        UserAvatar(:user="$store.state.user.self" large)
      v-col.d-flex.flex-column.align-start(cols="7" offset="1")
        span(style="font-size:2rem") {{$store.state.user.self.name}}
        span(style="font-size:1rem") 簡單自介

  //------------- extension --------------------
  template(v-slot:extension)
    v-btn-toggle(
      v-model="tab_which"
      active-class="active"
      background-color="white"
      borderless
      mandatory
      style="margin-bottom: -2px"
    )
      v-btn.px-2.tab.white(
        :ripple="false"
        to="articles"
        key="articles"
        depressed
      ) 
        span 我的願望 (n)
        v-btn.pa-0(text) 全部
          v-icon mdi-menu-down
      v-btn.pa-0(
        style="min-width: 3px;"
        :ripple="false"
      )
        v-divider(vertical)
      v-btn.tab.white(
        :ripple="false"
				active-class="active"
        to="honorRoll"
        key="honorRoll"
        depressed
      ) 我的榮譽榜
</template>

<script>
import { mapState } from 'vuex';
export default {
  name: 'AppBarProfileM',
  components: {
    UserAvatar: () => import('@/components/UserAvatar'),
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
    tab_which: 'articles',
    imgUrl: '',
  }),
  computed: {
    ...mapState(['links']),
  },
  created() {
    //Myname = this.$store.username;
  },
  methods: {
    Back() {
      this.$router.go(-1);
    },
    logout() {
      this.$store.dispatch('logout');
      this.$router.push('/');
    },
    getIMG(srcUrl) {
      this.imgUrl = '/media/' + srcUrl;
      console.log(srcUrl);
      console.log(this.imgUrl);
    },
  },
};
</script>

<style scoped>
.tab {
  width: 50vw;
  opacity: 0.5 !important;
}

.v-tab:before {
  background-color: transparent;
  /* opacity: 0; */
}

.v-application .primary--text {
  color: grey;
}

.v-btn:before {
  background-color: transparent;
}

.theme--light.v-btn--active::before {
  opacity: 0 !important;
}

.active {
  background-color: white !important;
  opacity: 1 !important;
  /* font-size: 2rem !important; */
}
</style>
<style>
.v-toolbar__extension {
  padding: 0 0 !important;
  background-color: white !important;
}
</style>
