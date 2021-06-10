<template lang="pug">
v-app-bar.d-flex.align-center.flex-wrap.justify-start(
  app
  flat
  prominent
  color="#CED3CD"
  height="180"
  extension-height="50"
)
  v-container.ma-0.fill-height(fluid style="width: 100vw")
    v-row.align-self-start(no-gutters)
      v-col(cols="6")
        v-icon(@click.stop="Back") mdi-chevron-left
      v-col.d-flex.justify-end.pr-3(cols="6")
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
    v-row.px-3.align-self-center.align-center(no-gutters)
      v-col(cols="3")
        UserAvatar(:user="$store.state.user" large)
        //- v-avatar.grey.lighten-3(size="100" color="red")
        //-   img(:src="imgUrl" v-if="imgUrl")
        //-   span(style="font-size:2rem" v-else) {{$store.state.user.name[0]}}
      v-col.d-flex.flex-column.align-start(cols="7")
        span(style="font-size:2rem") {{$store.state.user.name}}
        span(style="font-size:1rem") 簡單自介
      v-col(cols="2")
  template(v-slot:extension)
    //- v-row.white.pa-0.ma-0(no-gutters)
    //-   v-btn(
    //-     text
    //-   )
    //-     span() 我的願望 (n)
    //-     v-btn(text) 全部

    //-   v-btn
    v-tabs(hide-slider v-model="tab_which")
      v-tab.px-2.tab.white(
        :ripple="false"
        active-class="white"
        to="articles"
        key="articles"
      ) 
        span 我的願望 (n)
        v-btn.pa-0(text) 全部
          v-icon mdi-menu-down
      v-tab.pa-0.white(
        style="min-width: 3px;"
        :ripple="false"
      )
        v-divider(vertical)
      v-tab.tab.white(
        :ripple="false"
        active-class="white"
        to="honorRoll"
        key="honorRoll"
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
}

.v-tab:before {
  background-color: transparent;
  /* opacity: 0; */
}

.v-application .primary--text {
  color: grey;
}
</style>
