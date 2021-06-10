<template lang="pug">
v-card.ma-1.pa-1.transparent.d-flex.align-center(
  v-if="author"
  flat
  min-height="48"
)
  UserAvatar(:user="context")
  .px-1
  span {{ author.username }}
  .px-2
  span {{ context.body }}
</template>

<script>
export default {
  name: 'CommentCard',
  components: {
    UserAvatar: () => import('@/components/UserAvatar'),
  },
  /*
  comment = {
      "id": "1",
      "date": "abc",
      "body": "this is a comment",
      "from": "0"
  }
  */
  props: {
    context: {
      type: Object,
      required: true,
    },
  },
  data: () => ({
    author: undefined,
  }),

  created() {},
  methods: {},
};
</script>

<style>
.pre {
  white-space: pre-wrap;
}
</style>
