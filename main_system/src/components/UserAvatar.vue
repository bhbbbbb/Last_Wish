<template lang="pug">
v-avatar.grey.lighten-3(:size="large ? 80 : 40")
  img(:src="baseURL + user.pro_pic" v-if="user.pro_pic")
  span(:style="`font-size:${large ? 2 : 1.5}rem`" v-else) {{ user.name[0] }}
</template>

<script>
import { baseURL } from '@/store/api';
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
    baseURL,
  }),
  created() {},
};
</script>

<style scoped></style>
