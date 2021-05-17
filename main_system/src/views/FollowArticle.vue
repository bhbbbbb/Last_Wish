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
    this.articles = this.$store.state.followed_articles;
  },
};
</script>
