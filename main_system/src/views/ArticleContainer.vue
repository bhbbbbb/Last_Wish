<template lang="pug">
v-sheet.d-flex.flex-wrap(min-height="70vh" rounded="lg")

  v-col(
    cols="12"
    v-for="(article, idx) in articles",
    :key="idx"
  )
    ArticleCard(
      :content="article"
      @click.stop="ToInnerArticle(article.id)"
    )

  v-col(
    v-if="is_login"
    cols="12"
    order-sm="first"
    :class="$vuetify.breakpoint.mobile ? 'fixed-bottom' : ''"
  )
    NewPost/

      
</template>

<script>
import {mapState} from 'vuex'
export default {
    name: 'ArticleContainer',
    
    components: {
      ArticleCard: () => import('@/components/article/ArticleCard.vue'),
      RecordCard: () => import('@/components/RecordCard'),
      NewPost: () => import('@/components/NewPost'),
      NewRecord: () => import('@/components/NewRecord'),
    },

    computed: {
      ...mapState(['articles', 'is_login']),
    },

    methods: {
      ToInnerArticle(article_id) {
        this.$router.push({name: 'Article', params: {id: article_id}});
      }
    },
    created() {
      // without running 'getData' the articles would be blank
      this.$store.dispatch('getData');
    },
}
</script>

<style lang="sass" scoped>
.fixed-bottom
  position: sticky
  bottom: 0
</style>