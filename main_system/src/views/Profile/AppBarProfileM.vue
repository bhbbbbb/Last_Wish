<template lang="pug">
v-app-bar(
  app
  flat
  prominent
  color="#CED3CD"
  height="180"
  extension-height="50"
  clipped-left
)
  v-card.pa-0.px-0.ma-0(
    width="100%"
    color="transparent"
    :loading="!user ? 'grey' : false"
    flat
  )
    v-row.align-self-start(no-gutters v-if="user")
      v-col(cols="6")
        //- v-icon(@click.stop="Back") mdi-chevron-left
      v-col.d-flex.justify-end.pr-0(cols="6" v-if="username === $store.state.user.self.name")
        v-menu(offset-y)
          template(#activator="{ on, attrs }")
            v-btn(
              icon
              v-bind="attrs"
              v-on="on"
            ) 
              v-icon mdi-cog
          v-list
            MsgBox(@confirm="setIntroConfirm")
              SelfIntro(v-model="intro")
              template(#activator="{ on, attrs }")
                v-list-item(
                  v-on="on"
                  v-bind="attrs"
                )
                  v-list-item-title 設定自介
            v-list-item(
              to="upl"
            )
              v-list-item-title 設定頭貼
            v-list-item(@click="logout")
              v-list-item-title 登出
    v-row.px-3.align-center.align-start(no-gutters v-if="user")
      v-col(cols="3")
        UserAvatar(:user="user" large)
      v-col(cols="7" offset="1")
        v-row.align-center(no-gutters)
          span(style="font-size:2rem") {{ user.name }}
          v-chip.mx-2(
            color="#8B9988"
            small
            dark
          ) LV. {{ user.lv }}
        v-row(no-gutters)
          span(style="font-size:1rem") {{ static_intro }}

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
        v-if="user"
      ) 
        span(style="text-transform: none;") {{ user.name }}
        span 的計畫
        span() {{ num_of_aritlces }}
        //- v-btn.pa-0(text :ripple="false") 全部
          v-icon mdi-menu-down
      v-btn.pa-0(
        style="min-width: 3px;"
        :ripple="false"
      )
        v-divider(vertical)
      v-btn.tab.white(
        v-if="user"
        :ripple="false"
				active-class="active"
        :to="{ name: 'HonorRoll', params: { user }}"
        key="honorRoll"
        depressed
      ) 我的榮譽榜
</template>

<script>
import { mapState } from 'vuex';
//import { apiSetSelfIntro } from '@/store/api'
export default {
  name: 'AppBarProfileM',
  components: {
    UserAvatar: () => import('@/components/UserAvatar'),
    MsgBox: () => import('@/components/MsgBox'),
    SelfIntro: () => import('@/components/SelfIntro'),
  },
  props: {
    username: {
      required: true,
      type: String,
    },
  },
  data: () => ({
    drawer: false,
    selected: 0,
    tab_which: 'articles',
    imgUrl: '',
    user: undefined,
    intro: undefined,
    static_intro: undefined,
  }),
  computed: {
    ...mapState(['links']),
    num_of_aritlces() {
      let num;
      if (this.user && this.$store.state.user.self.id === this.user.id)
        if (this.$store.state.article.self)
          num = this.$store.state.article.self.length;
        else if (this.$store.state.article.others)
          num = this.$store.state.article.others.length;
      return num ? `(${num})` : '';
    },
  },
  watch: {
    username() {
      this.init();
    },
  },
  created() {
    this.init();
  },
  methods: {
    async init() {
      this.user = undefined;
      if (this.$store.state.user.self.name === this.username) {
        this.user = await this.$store.dispatch('user/getSelfMore');
        this.intro = this.user.self_intro;
      } else {
        this.user = await this.$store.dispatch(
          'user/getOthersByName',
          this.username
        );
      }
      this.static_intro = this.user.self_intro;
    },
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
    setIntroConfirm() {
      this.$store.dispatch('user/updateIntro', this.intro);
      this.static_intro = this.intro;
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
