<template lang="pug">
router-link(
  :to="`/${user.name}`"
  custom
  v-slot="{ navigate, href, isActive }"
)
  a(:href="href" style="text-decoration: none; color: black" disabled)
    v-avatar.grey.lighten-3(
      :size="large ? 80 : 40"
      @click.stop="navigate"
      @mousedown.stop=""
      @touchstart.stop=""
    )
      img(:src="baseURL + user.pro_pic" v-if="user.pro_pic && !error" @error="error = true")
      span(:style="`font-size:${large ? 2 : 1.5}rem`" v-else) {{ user.name.charAt(0) }}
</template>

<script>
import config from '@/../config';
export default {
  name: 'UserAvatar',
  props: {
    user: {
      type: Object,
      required: true,
    },
    large: {
      type: Boolean,
      default: false,
    },
  },
  data: () => ({
    baseURL: config.imageUrl,
    error: false,
  }),
  created() {},
  beforeUpdate() {
    this.init();
  },
  methods: {
    init() {
      this.error = false;
    },
  },
};
</script>

<style scoped></style>
