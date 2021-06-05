<template lang="pug">
v-sheet(rounded="lg")
  v-row(no-gutters style="width: 100%")
    v-text-field(
      outlined
      clearable
      append-outer-icon="mdi-magnify"
      @focus="mode_options_show = true"
      autocomplete="off"
    )

  v-row(
    no-gutters
    style="width: 100%;margin-top: -30px;"
    v-show="mode_options_show"
  )
    v-tabs.justify-space-around(
      fixed-tabs
      v-model="search_mode"
      style="width: 100%;"
      mandatory
    )
      v-tab(value="all" height="25px") 全部
      v-tab(value="article" height="25px") 文章
      v-tab(value="tag" height="25px") 標籤
      v-tab(value="user" height="25px") 用戶

  v-row.flex-column-reverse(
    no-gutters
    :style="mode_options_show ? 'margin-top: -0px;' : 'margin-top: -20px;'"
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

  //- v-col(
  //-   v-if="is_login"
  //-   cols="12"
  //-   order-sm="first"
  //-   :class="$vuetify.breakpoint.mobile ? 'fixed-bottom' : ''"
  //- )
  //-   NewPost/

</template>

<script>
import color_list from '@/store/color_list.js';
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
  data: () => ({
    search_mode: 'all',
    mode_options_show: false,
  }),
  computed: {
    // ...mapState(['articles', 'is_login']),
  },
  created() {
    if (
      this.$store.state.is_login &&
      this.$store.state.followed_articles === undefined
    )
      this.$store.dispatch('getUserFollowed');
  },

  methods: {
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
  bottom: 0
</style>
