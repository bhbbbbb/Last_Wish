<template>
  <ArticleContainer v-if="articles && articles.length" :articles="articles" />
  <v-card v-else flat>
    <v-card-title class="justify-center">
      <h4>還沒有關注的文章，去世界文章看看吧</h4>
    </v-card-title>
    <v-card-actions class="justify-center">
      <v-btn :to="{ path: '/articles' }" color="#cccdc3"> Go </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  name: 'FollowArticle',
  components: {
    ArticleContainer: () => import('@/views/ArticleContainer'),
  },
  data: () => ({
    articles: undefined,
  }),
  computed: {},
  created() {
    this.articles = this.$store.state.followed_articles;
  },
};
</script>
