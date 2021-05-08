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

      
</template>

<script>
import {mapState} from 'vuex'
export default {
    name: 'UserArticles',
    
    components: {
      ArticleCard: () => import('@/components/article/ArticleCard.vue'),
      RecordCard: () => import('@/components/RecordCard'),
    },

    computed: {
      ...mapState(['articles', 'is_login']),
    },
    created() {
      // without running 'getData' the articles would be blank
      this.$store.dispatch('getData');
    },

    methods: {
      ToInnerArticle(article_id) {
        this.$router.push({name: 'UserArticle', params: {id: article_id, username: this.$store.state.username}});
      }
    },
}
</script>

<style lang="sass" scoped>
.fixed-bottom
  position: sticky
  bottom: 0
</style>