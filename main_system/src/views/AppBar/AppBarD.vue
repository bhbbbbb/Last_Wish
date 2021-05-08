<template lang="pug">
v-app-bar(app flat)

  v-tabs.ml-n9(
    centered="" color="grey darken-1"
  )
    v-tab(
      v-for="(link, idx) in links"
      :key="idx"
      :to="is_login ? {name: link.to.name, params: {username: username}} : link.to"
    )
      | {{ link.text }}

  v-avatar(
    color="grey darken-1 shrink" size="32"
    @click.stop="logout"
  )
    v-icon mdi-logout

</template>

<script>
import {
  mapState
} from 'vuex'
export default {
  name: 'AppBarD',
  components: {},
  props: {

  },
  data: () => ({
    drawer: false,
    selected: 0,
  }),
  computed: {
    ...mapState(['links', 'is_login', 'username']),

  },
  methods: {
    logout() {
      this.$store.dispatch('logout');
      if (this.$route.path !== '/articles') this.$router.push('/articles');
    }
  },

}
</script>
