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
    props: {
        comments: {
            type: Object,
            required: true,
        }
    },
    components: {
      CommentCard: () => import('@/components/article/CommentCard.vue'),
    },

    computed: {

    },

    methods: {

    },
    created() {
      // without running 'getData' the articles would be blank
      this.$store.dispatch('getData');
    },
}
</script>

<style lang="sass" scoped>

</style>