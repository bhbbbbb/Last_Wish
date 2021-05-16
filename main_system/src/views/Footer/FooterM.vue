<template lang="pug">
v-bottom-navigation(
  app
  v-model="selected"
  mandatory
  dense
  dark
  background-color="#9ba2aa"
  color="rgba(255, 255, 255, 1)"
)
  v-btn(
    v-for="link in links"
    :key="link.to.name"
    :to="is_login ? {name: link.to.name, params: {username: username}} : link.to"
  )
    span() {{ link.text }}
    v-icon() {{ link.icon }}

</template>

<script>
import { mapState } from 'vuex'
export default {
    name: 'FooterM',
    components: {
    },
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
      ...mapState(['links', 'is_login', 'username']),
      
    },
    
 
}
</script>

<style scoped>

</style>
