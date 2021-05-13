<template lang="pug">
v-app-bar.d-flex.align-center.flex-wrap(
  app
  flat
  prominent
  extended
  color="#CED3CD"
  height="180"
  extension-height="40"
)
  v-container.fill-height(style="width: 100vw")
    v-row.align-self-start(no-gutters)
      v-col(cols="12")
        v-icon(@click.stop="Back") mdi-chevron-left
    v-row.align-self-center.align-center(no-gutters)
      v-col(cols="3")
        v-avatar.grey.lighten-3(size="64")
      v-col.d-flex.flex-column.align-start(cols="7")
        span(style="font-size:2rem") {{this.$store.state.username}}
        span(style="font-size:1rem") 簡單自介
      v-col(cols="2")
  template(v-slot:extension)
    v-tabs(hide-slider)
      v-tab.tab.white(active-class="") 我的願望
      v-tab.tab.lighten-3(style="background-color: #CED3CD") ff
    SimpleUpload()
</template>

<script>
import {mapState} from 'vuex';
export default {
  name: 'AppBarProfileM',
    components: {
    SimpleUpload:()=> import('@/components/SimpleUpload')
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
  },
};
</script>

<style scoped>
.tab {
  border-radius: 15% 15% 0 0;
}

.v-tab:before {
  background-color: transparent;
  /* opacity: 0; */
}

.v-application .primary--text {
  color: grey;
}
</style>
