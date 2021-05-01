<template>
  <v-app>
    <!-- <router-view name="AppBar"/>
    <router-view name="Main"/> -->
    <AppBarM v-if="this.$vuetify.breakpoint.mobile"/>
    <AppBarD v-else/>
    <router-view/>
    <FooterM v-if="this.$vuetify.breakpoint.mobile"/>
  </v-app>
</template>

<script>

export default {
  name: 'App',

  components: {
    AppBarD: () => import('@/components/AppBar/AppBarD'),
    AppBarM: () => import('@/components/AppBar/AppBarM'),
    FooterM: () => import('@/components/FooterM')
  },

  data: () => ({
    //
  }),
};
</script>
