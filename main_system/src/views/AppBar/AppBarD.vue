<template lang="pug">
v-app-bar(app flat)

  v-tabs.ml-n9(
    centered="" color="grey darken-1"
  )
    v-tab(
      v-for="(link, idx) in $store.links"
      :key="idx"
      :to="$store.is_login ? {name: link.to.name, params: {username: $store.user.self.name}} : link.to"
    )
      | {{ link.text }}

  v-avatar(
    color="grey darken-1 shrink" size="32"
    @click.stop="logout"
  )
    v-icon mdi-logout

</template>

<script>
export default {
  name: 'AppBarD',
  components: {},
  props: {},
  data: () => ({
    drawer: false,
    selected: 0,
  }),
  methods: {
    logout() {
      this.$store.dispatch('logout');
      if (this.$route.path !== '/articles') this.$router.push('/articles');
    },
  },
};
</script>
