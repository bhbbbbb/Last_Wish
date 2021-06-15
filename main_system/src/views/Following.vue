<template>
  <ArticleContainer v-if="articles && articles.length" :articles="articles" />
  <v-card v-else flat>
    <v-card-title class="justify-center">
      <h4>這東西還沒做完啦哈哈</h4>
    </v-card-title>
  </v-card>
</template>

<script>
export default {
  name: 'App',
  components: {
    ArticleContainer: () => import('@/views/ArticleContainer'),
  },
  data: () => ({
    articles: undefined,
  }),
  computed: {},
  created() {
    if (this.$store.state.article.global)
      this.articles = this.$store.state.article.global;
  },
};
</script>
