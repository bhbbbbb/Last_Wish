<template lang="pug">
v-sheet.d-flex.flex-wrap(min-height="70vh" rounded="lg")

  v-col.ma-0.pa-0(
    v-if="articles"
    cols="12"
    v-for="(article, idx) in articles",
    :key="idx"
  )
    ArticleCard(
      :content="article"
      :color="$store.state.COLOR_LIST[idx % $store.state.COLOR_LIST.length]"
      @click.stop="ToInnerArticle(article.id, idx)"
    )

  //- v-col(
  //-   v-if="is_login"
  //-   cols="12"
  //-   order-sm="first"
  //-   :class="$vuetify.breakpoint.mobile ? 'fixed-bottom' : ''"
  //- )
  //-   NewPost/

</template>

<script>
import { apiUserFollowedPosts } from '@/store/api';
export default {
  name: 'ArticleContainer',

  components: {
    ArticleCard: () => import('@/components/article/ArticleCard.vue'),
    // RecordCard: () => import('@/components/RecordCard'),
    // NewPost: () => import('@/components/NewPost'),
    // NewRecord: () => import('@/components/NewRecord'),
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
  computed: {
    // ...mapState(['articles', 'is_login']),
  },
  created() {
    if (this.$store.state.followed_articles == undefined)
      apiUserFollowedPosts({ username: this.$store.state.username }).then(
        (res) => {
          this.$store.state.followed_articles = res.data;
        }
      );
    // without running 'getGlobalArticles' the articles would be blank
    // this.$store.dispatch('getGlobalArticles');
  },

  methods: {
    ToInnerArticle(article_id, idx) {
      let to_name = this.toUser ? 'UserArticle' : 'Article';
      this.$router.push({
        name: to_name,
        params: {
          id: article_id,
          context: this.articles[idx],
          color: this.$store.state.COLOR_LIST[idx],
        },
      });
    },
  },
};
</script>

<style lang="sass" scoped>
.fixed-bottom
  position: sticky
  bottom: 0
</style>
