<template lang="pug">
v-sheet.m-view(rounded="lg")
  Search(
    v-if="type === 'global'"
    @update="updateSorF"
    @update:value="search"
    :value="value_model"
    :mode.sync="mode_model"
    :s.sync="s_model"
    :f.sync="f_model"
    @focus="focus"
    @blur="blur"
    @cancel="cancel"
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
      v-lazy(
        :options="{ threshold: 0.1 }"
        min-height="200"
      )
        ArticleCard(
          :id="id"
        )

  v-row(
    no-gutters
    v-else-if="articles"
  )
    v-col.d-flex.align-center.justify-center(cols="12" style="height: 60vh")
      span() 哎呀，看來這裡一篇文章都沒有

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
    },
    s: {
      type: String,
      default: 'new2old',
    },
    f: {
      type: String,
      default: 'all',
    },
  },
  data: () => ({
    articles: undefined,
    articles_seg: undefined,
    stamp: 0,
    value_model: undefined,
    mode_model: undefined,
    s_model: undefined,
    f_model: undefined,
    focusing: false,
  }),
  computed: {},
  watch: {
    type() {
      this.fetchArticles();
    },
  },
  created() {
    this.value_model = this.value ? this.value : '';
    this.mode_model = this.mode;
    this.s_model = this.s;
    this.f_model = this.f;
  },
  mounted() {
    // if (this.user) this.getSearchedUserArticles(this.user);
    if (this.value) this.search(this.value);
    else this.fetchArticles();
  },
  methods: {
    search(val) {
      this.value_model = val;
      if (!val) {
        // this.fetchArticles();
        this.articles = [];
        return;
      }
      this.articles = undefined;
      let tem;
      let mode = this.mode_model;
      switch (mode) {
        case ALL:
          tem = apiSearchArticles(val, this.s_model, this.f_model);
          break;
        case ARTICLES:
          tem = apiSearchArticles(val, this.s_model, this.f_model);
          break;
        case TAGS:
          tem = apiSearchTags(val, this.s_model, this.f_model);
          break;
        case USER:
          tem = apiSearchUser(val, this.s_model, this.f_model);
          break;
        default:
          throw `value of mode = ${mode} is not defined`;
      }
      let stamp = ++this.stamp;
      tem.then(({ data }) => {
        if (stamp === this.stamp) {
          if (mode === USER && data.length)
            this.getSearchedUserArticles(data[0], stamp);
          else {
            this.articles = data;
            this.$router.replace({
              query: {
                q: val,
                mode,
                s: this.s_model,
                f: this.f_model,
                stamp: Date.now(),
              },
            });
          }
        }
      });
    },
    async getSearchedUserArticles(user_id, stamp) {
      let data = await this.$store.dispatch('getUserArticles', {
        user_id,
        sort_by: this.s_model,
        filter: this.f_model,
      });
      if (!stamp || stamp === this.stamp) {
        this.$router.replace({
          query: {
            q: this.value_model,
            mode: USER,
            s: this.s_model,
            f: this.f_model,
            stamp: Date.now(),
          },
        });
        this.articles = data;
      }
    },
    updateSorF() {
      if (!this.value_model) this.fetchArticles();
      else this.search(this.value_model);
    },
    async fetchArticles(type) {
      if (this.focusing) return;
      if (!type) type = this.type;
      if (this.s_model === 'defalut') this.s_model = 'new2old';
      if (type !== 'others')
        this.articles = this.$store.getters.articles(
          type,
          this.s_model,
          this.f_model
        );
      else this.articles = undefined;
      if (!this.articles || type === 'others') {
        this.articles = undefined;
        this.$store
          .dispatch('getArticles', {
            type: type,
            sort_by: this.s_model,
            filter: this.f_model,
            username: this.username, // only be true when type = 'others'
          })
          .then((data) => {
            this.articles = data;
          });
      }
    },
    focus() {
      this.focusing = true;
      // if (!this.value_model) this.articles = [];
    },
    blur() {
      this.focusing = false;
      if (!this.value_model) {
        this.articles = undefined;
        this.fetchArticles();
      }
    },
    cancel() {
      this.focusing = false;
      this.articles = undefined;
      this.fetchArticles();
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
