<template lang="pug">
v-sheet(min-height="70vh" rounded="lg")
  v-col(v-if="is_login && !$vuetify.breakpoint.mobile" cols="12")
    NewPost/
  v-col(
    cols="12"
    v-for="(article, idx) in articles",
    :key="idx"
  )
    ArticleCard(
      :content="article"
    )
  v-col.fixed-bottom(v-if="is_login && $vuetify.breakpoint.mobile" cols="12")
    NewPost/
      
</template>

<script>
// @ is an alias to /src
import {mapState} from 'vuex'
export default {
    name: 'ArticleContainer',
    
    components: {
      ArticleCard: () => import('@/components/ArticleCard.vue'),
      RecordCard: () => import('@/components/RecordCard'),
      NewPost: () => import('@/components/NewPost'),
      NewRecord: () => import('@/components/NewRecord'),
    },

    computed: {
      ...mapState(['articles', 'is_login']),
    },
    created() {

      // without running 'getData' the articles would be blank
      this.$store.dispatch('getData');
    }
}
</script>

<style lang="sass" scoped>
.fixed-bottom
  position: sticky
  bottom: 0
</style>