<template lang="pug">
v-container.pa-0()
  v-row.justify-center.mar()
    v-col.pa-0.ma-0(cols="12" sm="6")
      router-view/
</template>

<script>
export default {
  name: 'Home',
  components: {},
};
</script>

<style scoped>
.mar {
  margin-left: 30px;
  margin-right: 30px;
  margin-top: 17px;
}
</style>
