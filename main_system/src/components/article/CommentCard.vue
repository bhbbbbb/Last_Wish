<template lang="pug">
v-card.ma-1.pa-1.transparent.d-flex.align-center(
  flat
  min-height="48"
  :loading="!author && 'grey'"
)
  UserAvatar(v-if="author" :user="author")
  .px-1
  v-container.pa-0
    v-row(no-gutters)
      NavLink(v-if="author" :to="`/${author.name}`")
        span {{ author.name }}
      .px-2
      span {{ content.body }}
    v-row(no-gutters)
      span.caption {{ date }}
</template>

<script>
import moment from 'moment';
export default {
  name: 'CommentCard',
  components: {
    UserAvatar: () => import('@/components/UserAvatar'),
    NavLink: () => import('@/components/NavLink'),
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
    content: {
      type: Object,
      required: true,
    },
  },
  data: () => ({
    author: undefined,
  }),
  computed: {
    date() {
      return moment(this.content.date).fromNow();
    },
  },

  mounted() {
    this.$store.dispatch('getUser', this.content.author).then((res) => {
      this.author = res;
    });
  },
  methods: {},
};
</script>

<style>
.pre {
  white-space: pre-wrap;
}
</style>
