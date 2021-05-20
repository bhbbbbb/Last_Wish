<template lang="pug">
v-sheet(min-height="70vh" rounded="lg")
  v-col(
    cols="12"
    v-for="(comment, idx) in comments",
    :key="idx"
  )
    CommentCard(
      :content="comment"
    )

</template>

<script>
// import {mapState} from 'vuex'
export default {
  name: 'Comments',
  components: {
    CommentCard: () => import('@/components/article/CommentCard.vue'),
  },
  props: {
    comments: {
      type: Object,
      required: true,
    },
  },

  computed: {},
  created() {
    // without running 'getGlobalArticles' the articles would be blank
    this.$store.dispatch('getGlobalArticles');
  },

  methods: {},
};
</script>

<style lang="sass" scoped></style>
