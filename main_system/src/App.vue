<template>
  <v-app>
    <router-view name="AppBar"/>
    <router-view name="Main"/>
  </v-app>
</template>

<script>

export default {
  name: 'App',

  components: {
  },

  data: () => ({
    //
  }),
};
</script>
