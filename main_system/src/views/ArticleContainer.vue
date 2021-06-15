<template lang="pug">
v-sheet(rounded="lg")
  Search()
  v-row(
    no-gutters
  )
    v-col.ma-0.pa-0(
      cols="12"
      v-for="(id, idx) in articles",
      :key="idx"
    )
      ArticleCard(
        :id="id"
        :color="color_list(idx)"
        @click.stop="ToInnerArticle(id)"
      )

</template>

<script>
import color_list from '@/data/color_list';
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
    fetchAction: {
      required: true,
      type: String,
    },
  },
  data: () => ({}),
  computed: {},
  watch: {
    fetchAction() {
      this.$store.dispatch(this.fetchAction);
    },
  },
  created() {},
  mounted() {
    this.$store.dispatch(this.fetchAction);
  },
  methods: {
    ToInnerArticle(article_id) {
      this.$router.push({
        name: 'Article',
        params: {
          id: article_id,
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
