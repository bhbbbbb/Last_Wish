<template lang="pug">
v-sheet(rounded="lg")
  Search()
  v-row.flex-column-reverse(
    no-gutters
  )
    v-col.ma-0.pa-0(
      v-if="articles"
      cols="12"
      v-for="(article, idx) in articles",
      :key="idx"
    )
      ArticleCard(
        :content="article"
        :color="color_list(article.id)"
        @click.stop="ToInnerArticle(article.id, idx)"
      )

</template>

<script>
import color_list from '@/store/color_list.js';
export default {
  name: 'ArticleContainer',

  components: {
    ArticleCard: () => import('@/components/article/ArticleCard.vue'),
    Search: () => import('@/components/Search'),
  },
  props: {
    articles: {
      required: true,
      type: Array,
    },
    toUser: {
      required: false,
      type: Boolean,
      default: false,
    },
  },
  data: () => ({}),
  computed: {},
  created() {
    if (
      this.$store.state.is_login &&
      this.$store.state.followed_articles === undefined
    )
      this.$store.dispatch('getUserFollowed');
  },

  methods: {
    onScroll() {
      console.log('scroll');
    },
    ToInnerArticle(article_id, idx) {
      let to_name = this.toUser ? 'UserArticle' : 'Article';
      this.$router.push({
        name: to_name,
        params: {
          id: article_id,
          context: this.articles[idx],
        },
      });
    },
    color_list: color_list,
  },
};
</script>

<style lang="sass" scoped>
.fixed-bottom
  position: sticky
  top: 110px
  z-index: 1000
</style>
