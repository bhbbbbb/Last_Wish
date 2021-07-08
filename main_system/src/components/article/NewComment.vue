<template lang="pug">
v-sheet.ma-1.pa-1.transparent.d-flex.align-center(
  flat
  min-height="48"
  v-if="$store.state.is_login"
)
  div
  UserAvatar(:user="$store.state.user.self")
  span.px-1.mx-2 {{ $store.state.user.self.name }}
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
import moment from 'moment';
export default {
  name: 'NewComment',

  components: {
    UserAvatar: () => import('@/components/UserAvatar'),
  },
  props: {
    articleId: {
      required: true,
      type: String,
    },
  },
  data: () => ({
    new_comment: undefined,
  }),

  created() {},
  methods: {
    SubmitNewComment() {
      if (!this.new_comment.trim()) return;
      // apiAddComment(this.articleId, this.new_comment);
      this.$store.dispatch('addComment', {
        article_id: this.articleId,
        new_comment: this.new_comment,
      });
      this.$emit('created', {
        likes: 0,
        _id: undefined,
        author: this.$store.state.user.self.id,
        body: this.new_comment,
        date: moment(),
      });
      this.new_comment = '';
    },
  },
};
</script>
