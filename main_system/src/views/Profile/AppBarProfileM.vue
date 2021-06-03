<template lang="pug">
Upl()
</template>

<script>
import { mapState } from 'vuex';
export default {
  name: 'AppBarProfileM',
  components: {
    //SimpleUpload:()=> import('@/components/SimpleUpload')
    Upl:()=> import ('@/components/Upl')
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
