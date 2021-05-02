<template lang="pug">
component(:is="which") 

</template>

<script>
export default {
  name: 'AppBarWrap',
  components: {
    AppBarD: () => import('@/components/AppBar/AppBarD'),
    AppBarM: () => import('@/components/AppBar/AppBarM'),
    AppBarProfileM: () => import('@/views/Profile/AppBarProfileM')
  },
  props: {
    
  },
  data: () => ({
    which: undefined,
  }),
  watch: {
    '$vuetify.breakpoint.mobile': function(val) {
      if (!val) this.which = 'AppBarD';
      else this.which = 'AppBarM';
    }
  },
  created() {

    if (!this.$vuetify.breakpoint.mobile) this.which = 'AppBarD';
    else this.which = 'AppBarM';
  },
  beforeRouteUpdate(to, from, next) {
    if (!this.$vuetify.breakpoint.mobile) this.which = 'AppBarD';
    else this.which = 'AppBarM';
    next();
  }
}
</script>
