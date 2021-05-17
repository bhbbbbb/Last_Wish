<template lang="pug">
v-card.ma-0.pa-0.transparent.d-flex.align-center(
  v-if="author"
  flat
  min-height="48"
)
  v-avatar(size="32")
    v-icon(large) mdi-account
  .px-1
  span {{ author.username }}
  .px-2
  span {{ context.body }}
</template>

<script>
import { apiGetPublicInfo } from '@/store/api';
export default {
  name: 'CommentCard',

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

  created() {
    this.getAuthor()
      .then((res) => {
        this.author = res.data;
      })
      .catch((err) => {
        console.log(err);
      });
  },
  methods: {
    async getAuthor() {
      return await apiGetPublicInfo(this.context.from);
    },
  },
};
</script>

<style>
.pre {
  white-space: pre-wrap;
}
</style>
