<template lang="pug">
v-app-bar.d-flex.align-center.flex-wrap.justify-center(
  app
  flat
  prominent
  color="#CED3CD"
  height="180"
)
  v-container.ma-0.fill-height(fluid style="width: 100vw")
    v-row.align-self-start(no-gutters)
      v-col(cols="6")
        v-icon(@click.stop="Back") mdi-chevron-left
      v-col.d-flex.justify-end(cols="6")
        v-icon() mdi-cog
    v-row.px-3.align-self-center.align-center(no-gutters)
      v-col(cols="3")
        v-avatar.grey.lighten-3(size="64" @click="$store.dispatch('logout')")
          img(src="/media/blob.jpg" alt="Jhns")
      v-col.d-flex.flex-column.align-start(cols="7")
        span(style="font-size:2rem") {{this.$store.state.username}}
        span(style="font-size:1rem") 簡單自介
      v-col(cols="2")
    Upl()
</template>

<script>
import { mapState } from 'vuex';
export default {
  name: 'AppBarProfileM',
  components: {
    //SimpleUpload:()=> import('@/components/SimpleUpload')
    Upl: () => import('@/components/Upl'),
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
