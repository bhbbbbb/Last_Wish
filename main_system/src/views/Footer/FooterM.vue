<template lang="pug">
v-bottom-navigation(
  v-if="$vuetify.breakpoint.mobile"
  app
  v-model="selected"
  mandatory
  dense
  dark
  background-color="#9ba2aa"
  color="rgba(255, 255, 255, 1)"
  grow
)
  v-btn.mx-0(
    v-for="link in links"
    :key="link.to.name"
    :to="is_login ? {name: link.to.name, params: {username: self.name}} : link.to"
  )
    span() {{ link.text }}
    v-icon() {{ link.icon }}

</template>

<script>
import { mapState } from 'vuex';
export default {
  name: 'FooterM',
  components: {},
  props: {
    // links: {
    //   required: true,
    //   type: Array
    // },
  },
  data: () => ({
    selected: 0,
  }),
  computed: {
    ...mapState({
      links: (state) => state.links,
      is_login: (state) => state.is_login,
      self: (state) => state.user.self,
    }),
  },
};
</script>

<style>
.v-item-group.v-bottom-navigation .v-btn {
  min-width: 64px !important;
}
</style>
