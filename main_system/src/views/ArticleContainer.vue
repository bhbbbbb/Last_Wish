<template lang="pug">
v-sheet.m-view(rounded="lg")
  Search(
    v-if="type === 'global' || type === 'followed'"
    @update="updateArticles"
  )
  v-row(
    no-gutters
    v-if="articles"
  )
    v-col.ma-0.pa-0.pa-sm-2.pm-md-2(
      cols="12"
      sm="6"
      lg="4"
      v-for="(id, idx) in articles",
      :key="idx"
      v-if="$store.state.article.data[id] !== false"
    )
      ArticleCard(
        :id="id"
      )
    
    //- #loading
  v-row(
    no-gutters
    v-else
  )
    v-col.d-flex.align-center.justify-center(cols="12" style="height: 60vh")
      v-progress-circular(
        indeterminate
        size="64"
        color="grey"
      )
    


</template>

<script>
export default {
  name: 'ArticleContainer',

  components: {
    ArticleCard: () => import('@/components/article/ArticleCard.vue'),
    Search: () => import('@/components/Search'),
  },
  props: {
    type: {
      required: true,
      type: String,
      validator: (val) =>
        ['global', 'followed', 'self', 'others'].includes(val),
    },
    username: {
      required: false,
      type: String,
      default: undefined,
    },
  },
  data: () => ({
    articles: undefined,
    sort_by: 'new2old',
    filter: 'all',
  }),
  computed: {},
  watch: {
    type() {
      this.fetchArticles();
    },
  },
  created() {},
  mounted() {
    this.fetchArticles();
  },
  methods: {
    updateArticles({ sort_by, filter }) {
      this.sort_by = sort_by;
      this.filter = filter;
      this.fetchArticles();
    },
    async fetchArticles() {
      this.articles = this.$store.getters.articles(
        this.type,
        this.sort_by,
        this.filter
      );
      if (!this.articles)
        this.$store
          .dispatch('getArticles', {
            type: this.type,
            sort_by: this.sort_by,
            filter: this.filter,
          })
          .then((data) => {
            this.articles = data;
          });
    },
  },
};
</script>

<style lang="sass" scoped>
.fixed-bottom
  position: sticky
  top: 110px
  z-index: 1000
</style>
