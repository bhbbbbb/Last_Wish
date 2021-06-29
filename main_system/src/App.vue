<template>
  <v-app>
    <router-view name="AppBar" />
    <v-main>
      <router-view name="Main" />
    </v-main>
    <!-- <router-view name="SideBar" v-if="!$vuetify.breakpoint.mobile" /> -->
    <router-view name="Footer" />
    <SideBar v-if="!$vuetify.breakpoint.mobile" />
    <!-- <FooterM v-else-if /> -->

    <!-- <AppBarM v-if="this.$vuetify.breakpoint.mobile"/>
    <AppBarD v-else/>
    <router-view style="'padding-top:10vh'"/>
    <FooterM v-if="this.$vuetify.breakpoint.mobile"/> -->
    <!-- <div class="section">
      <div class="container">
        <simple-upload />
      </div> 
    </div>-->
  </v-app>
</template>

<script>
export default {
  name: 'App',
  components: {
    //SimpleUpload:()=> import('@/components/SimpleUpload')
    // AppBarD: () => import('@/components/AppBar/AppBarD'),
    // AppBarM: () => import('@/components/AppBar/AppBarM'),
    // FooterM: () => import('@/views/Footer/FooterM'),
    SideBar: () => import('@/views/SideBar'),
  },

  data: () => ({
    //
  }),
};
</script>
<style>
html {
  font-family: 'Roboto', sans-serif;
}
</style>
