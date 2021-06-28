<template lang="pug">
v-container.pa-0.align-start.justify-center(fill-height)
  v-row.justify-center.mar(style="width: 90vw;")
    v-col.pa-0.ma-0(cols="12" sm="12" md="10")
      router-view(v-if="$vuetify.breakpoint.mobile")/
      MobileRequest(v-else)
</template>

<script>
export default {
  name: 'Home',
  components: {
    MobileRequest: () => import('@/views/Home/MobileRequest'),
  },
};
</script>

<style scoped>
.mar {
  margin-left: 0px;
  margin-right: 0px;
  margin-top: 0px;
  margin-bottom: 17px;
}
</style>
