<template lang="pug">
component(:is="which") 

</template>

<script>
export default {
  name: 'AppBarWrap',
  components: {
    // AppBarD: () => import('@/views/AppBar/AppBarD'),
    AppBarM: () => import('@/views/AppBar/AppBarM'),
    AppBarProfileM: () => import('@/views/Profile/AppBarProfileM'),
  },
  props: {},
  data: () => ({
    which: undefined,
  }),
  watch: {
    '$vuetify.breakpoint.mobile': function (val) {
      if (!val) this.which = 'AppBarM';
      //D
      else this.which = 'AppBarM';
    },
  },
  created() {
    if (!this.$vuetify.breakpoint.mobile) this.which = 'AppBarM';
    // D
    else this.which = 'AppBarM';
  },
  beforeRouteUpdate(to, from, next) {
    if (!this.$vuetify.breakpoint.mobile) this.which = 'AppBarM';
    // D
    else this.which = 'AppBarM';
    next();
  },
};
</script>
