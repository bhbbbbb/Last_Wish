<template lang="pug">
v-sheet.m-view(rounded="lg")
  Search(
    v-if="type === 'global' || type === 'followed'"
    @update="updateArticles"
    @update:value="search"
    :value="value"
    :mode="mode"
  )
  v-row(
    no-gutters
    v-if="articles && articles.length"
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

  v-row(
    no-gutters
    v-else-if="articles"
  )
    v-col.d-flex.align-center.justify-center(cols="12" style="height: 60vh")
      span 哎呀，看來這裡一篇文章都沒有

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
import { apiSearchArticles, apiSearchUser, apiSearchTags } from '@/store/api';
const ALL = 0,
  ARTICLES = 1,
  TAGS = 2,
  USER = 3;
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
    user: {
      //id
      type: String,
      default: undefined,
    },
    value: {
      type: String,
      default: undefined,
    },
    mode: {
      type: Number,
      default: 1,
      validator: (val) => [0, 1, 2, 3].includes(val),
    },
  },
  data: () => ({
    articles: undefined,
    sort_by: 'new2old',
    filter: 'all',
    stamp: 0,
  }),
  computed: {},
  watch: {
    type() {
      this.fetchArticles();
    },
  },
  created() {},
  mounted() {
    if (this.user) this.getSearchedUserArticles(this.user);
    if (this.value) this.search({ value: this.value, mode: this.mode });
    else this.fetchArticles();
  },
  methods: {
    search({ value: val, mode }) {
      if (!val) {
        this.fetchArticles();
        return;
      }
      this.articles = undefined;
      let tem;
      switch (mode) {
        case ALL:
          tem = apiSearchArticles(val);
          break;
        case ARTICLES:
          tem = apiSearchArticles(val);
          break;
        case TAGS:
          tem = apiSearchTags(val);
          break;
        case USER:
          tem = apiSearchUser(val);
          break;
        default:
          throw `value of mode = ${mode} is not defined`;
      }
      let stamp = ++this.stamp;
      tem.then(({ data }) => {
        if (stamp === this.stamp) {
          if (mode === USER) this.getSearchedUserArticles(data, stamp);
          else {
            this.articles = data;
            this.$router.replace({
              query: { q: val, mode, stamp: Date.now() },
            });
          }
        }
      });
    },
    async getSearchedUserArticles(user_id, stamp) {
      let data = await this.$store.dispatch('getUserArticles', {
        user_id,
        sort_by: this.sort_by,
        filter: this.filter,
      });
      if (!stamp || stamp === this.stamp) {
        this.$router.replace({
          query: { u: user_id, mode: USER, stamp: Date.now() },
        });
        this.articles = data;
      }
    },
    updateArticles({ sort_by, filter }) {
      this.sort_by = sort_by;
      this.filter = filter;
      this.fetchArticles();
    },
    async fetchArticles(type) {
      if (!type) type = this.type;
      this.articles = this.$store.getters.articles(
        type,
        this.sort_by,
        this.filter
      );
      if (!this.articles)
        this.$store
          .dispatch('getArticles', {
            type: type,
            sort_by: this.sort_by,
            filter: this.filter,
            username: this.username, // only be true when type = 'others'
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
