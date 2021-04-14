<template>
  <v-app>
    <core-app-bar />
    <router-view />
  </v-app>
</template>

<script>

export default {
  name: 'App',

  components: {
    CoreAppBar: () => import ('@/components/core/app_bar.vue'),
  },

  data: () => ({
    //
  }),
};
</script>
