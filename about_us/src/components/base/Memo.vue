<template>
  <v-card
    flat
    tile
    color="rgba(0, 0, 0, 0)"
    width="240"
    v-bind="$attrs"
    v-on="$listeners"
  >
    <slot />
  </v-card>
</template>

<script>
  export default {
    name: 'Memo',
  }
</script>
