<template lang="pug">
v-card.unselectable.mx-1.pa-1.my-2.transparent.d-flex.align-center(
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
      Body.mb-0(style="overflow-x: hidden;" :content="content.body")
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
    Body: () => import('@/components/Body'),
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
    this.$store.dispatch('user/getUser', this.content.author).then((res) => {
      this.author = res;
    });
  },
  methods: {
  },
};
</script>

<style>
.unselectable {
  user-select: none;
}
</style>
