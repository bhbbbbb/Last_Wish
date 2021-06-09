<template lang="pug">
v-sheet.ma-1.pa-1.transparent.d-flex.align-center(
  flat
  min-height="48"
)
  div
  UserAvatar(:user="$store.state.user")
  span.px-1.mx-2 {{ $store.state.user.name ? $store.state.user.name : "Anon."}}
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
          name: this.$store.state.user.name,
          id: this.$store.state.user.id,
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
