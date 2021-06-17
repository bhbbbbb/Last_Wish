<template lang="pug">
router-link(
  :to="to"
  custom
  v-slot="{ navigate, href }"
)
  v-hover(v-slot="{ hover }")
    a(
      :href="href"
      :style="`text-decoration: ${hover && underline ? 'underline' : 'none'}; color: black`"
      disabled
      @click.stop="navigate"
      @mousedown.stop=""
      @touchstart.stop=""
    )
      slot
</template>

<script>
export default {
  name: 'NavLink',
  props: {
    to: {
      type: [Object, String],
      required: true,
    },
    underline: {
      type: Boolean,
      required: false,
      default: true,
    },
  },
  data: () => ({}),
  created() {},
  methods: {},
};
</script>

<style scoped></style>
