<template>
  <v-app>
    <router-view name="AppBar"/>
    <v-main>
      <router-view name="Main"/>
    </v-main>
    <router-view name="Footer"/>
    <!-- <AppBarM v-if="this.$vuetify.breakpoint.mobile"/>
    <AppBarD v-else/>
    <router-view style="'padding-top:10vh'"/>
    <FooterM v-if="this.$vuetify.breakpoint.mobile"/> -->
  </v-app>
</template>

<script>

export default {
  name: 'App',

  components: {
    // AppBarD: () => import('@/components/AppBar/AppBarD'),
    // AppBarM: () => import('@/components/AppBar/AppBarM'),
    // FooterM: () => import('@/components/FooterM')
  },

  data: () => ({
    //
  }),
};
</script>
