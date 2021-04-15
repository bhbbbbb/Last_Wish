<template lang="pug">
v-sheet(min-height="70vh" rounded="lg")
  NewPost(v-if="is_login")/         
  v-col(
    cols="12"
    v-for="(article, idx) in articles",
    :key="idx"
  )
    ArticleCard(
      :content="article"
    )
</template>

<script>
// @ is an alias to /src
import {mapState} from 'vuex'
export default {
    name: 'ArticleContainer',
    
    components: {
      ArticleCard: () => import('@/components/ArticleCard.vue'),
      NewPost: () => import('@/components/NewPost'),
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