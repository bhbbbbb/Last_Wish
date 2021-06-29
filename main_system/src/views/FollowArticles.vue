<template>
  <ArticleContainer
    v-if="!fetched || (articles && articles.length)"
    type="followed"
    class="mt-3"
  />
  <v-card v-else flat class="m-view mt-3">
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
  name: 'FollowArticles',
  components: {
    ArticleContainer: () => import('@/views/ArticleContainer'),
  },
  data: () => ({
    articles: [],
    fetched: false,
  }),
  computed: {},
  created() {
    this.$store
      .dispatch('getFollowedArticles', { forceUpdate: false })
      .then((data) => {
        this.articles = data;
        this.fetched = true;
      });
  },
};
</script>
