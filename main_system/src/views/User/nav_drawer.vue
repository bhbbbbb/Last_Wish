<template lang="pug">
//- mobile
v-navigation-drawer(
  app
  v-model="drawer",
  absolute
  temporary
  bottom
)
  v-list(nav)
    v-list-item(
      v-for="idx in 10" :key="idx"
    )
      v-list-item-title  shit{{idx}}
</template>

<script>
export default {
  name: 'NavDrawer',
  props: ['drawer'],
  data: () => ({}),
  methods: {

  }
}
</script>
