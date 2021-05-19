<template lang="pug">
v-card.ma-1.pa-1.transparent.d-flex.align-center(
  flat
  min-height="48"
)
  v-avatar(size="32")
    v-icon(large) mdi-account
  .px-1
  span {{ $store.state.username ? $store.state.username : "Anon."}}
  v-text-field.my-0.mx-3.pa-1(
    style="transform: translateY(5px);"
    placeholder="comment here"
    v-model="new_comment"
    @keydown.enter="SubmitNewComment()"
    hint="press enter to submit"
    autocomplete="off"
  )


</template>

<script>
import { apiUploadComment } from '@/store/api';
export default {
  name: 'NewComment',

  /*
  comment = {
      "id": "1",
      "date": "abc",
      "body": "this is a comment",
      "from": "0"
  }
  */
  props: {},
  data: () => ({
    new_comment: undefined,
  }),

  created() {
    // this.getAuthor()
    //   .then((res) => {
    //     this.author = res.data;
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //   });
  },
  methods: {
    SubmitNewComment() {
      if (!this.new_comment.trim()) return;
      apiUploadComment({
        author: {
          name: this.$store.state.username,
          id: this.$store.state.user_id,
        },
        article_id: this.$route.params.id,
        comment: this.new_comment,
      }).then((res) => {
        this.$emit('update', res.data);
      });

      this.new_comment = '';
    },
  },
};
</script>

<style>
.pre {
  white-space: pre-wrap;
}
</style>
