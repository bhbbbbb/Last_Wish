<template>
  <ArticleContainer v-if="articles" :articles="articles" />
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
    if (this.$store.state.global_articles)
      this.articles = this.$store.state.global_articles;
  },
};
</script>
