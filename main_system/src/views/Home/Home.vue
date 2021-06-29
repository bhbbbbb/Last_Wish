<template lang="pug">
  v-row.justify-center.mar()
    v-col.pa-0.ma-0(cols="12" sm="12" md="12" lg="12")
      router-view/
</template>

<script>
export default {
  name: 'Home',
  components: {
    // MobileRequest: () => import('@/views/Home/MobileRequest'),
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
