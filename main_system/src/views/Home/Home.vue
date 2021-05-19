<template lang="pug">
v-container.pa-0.align-start(fill-height)
  v-row.justify-center.mar()
    v-col.pa-0.ma-0(cols="12" md="6")
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
  margin-left: 30px;
  margin-right: 30px;
  margin-top: 17px;
  margin-bottom: 17px;
}
</style>
