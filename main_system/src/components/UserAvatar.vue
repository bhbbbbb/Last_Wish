<template lang="pug">
v-avatar.grey.lighten-3(:size="large ? 100 : 40" color="red")
  img(:src="user.pro_pic" v-if="user.pro_pic")
  span(style="font-size:2rem" v-else) {{ user.name[0] }}
</template>

<script>
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
  data: () => ({}),
  created() {},
};
</script>

<style scoped></style>
