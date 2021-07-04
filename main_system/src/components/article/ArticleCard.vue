<template lang="pug">
v-card.my.pa-3(
    height="200"
    min-height="200"
    rounded="lg"
    :color="color"
    v-on="$listeners"
    :loading="Boolean(content) ? false : 'grey'"
    :to="{ name: 'Article', params: { id }}"
  )
  v-row(v-if="content" no-gutters)
    v-col.d-flex.flex-sm-grow-1.flex-nowrap.align-center(cols="6")
      UserAvatar(:user="content.author")
      NavLink(:to="`/${content.author.name}`")
        span.px-3
          | {{ content.author.name }}
    v-col.d-flex.align-center.flex-sm-shrink-1(cols="4")
      span.subtitle-2.text--disabled {{ date }}
    v-col.d-flex.justify-end.pl-2(cols="2")
      v-tooltip(bottom)
        span 引用這個計畫
        template(#activator="{ on, attrs }")
          v-btn(
            icon
            :disabled="!$store.state.is_login"
            v-on="on"
            v-bind="attrs"
            @click.stop.prevent="goLink"
            @mousedown.stop=""
            @touchstart.stop=""
          )
            v-icon(style="transform: rotate(0.125turn);") mdi-link
  v-row(v-if="content" no-gutters)
    v-col.pa-0.mt-n2.d-flex.flex-nowrap.align-center(
      offset="1"
      cols="auto"
      style="height: 16px;"
    )
      span.pl-3.ml-3.caption.mr-1(v-show="citation") 引用自
      NavLink.caption.font-weight-bold(
        v-if="citation"
        :to="{ name: 'User', params: { username: citation.author.name }}"
      ) {{ citation.author.name }}
      span.caption.ml-1(v-show="citation") 的
      NavLink.caption.font-weight-bold(
        v-if="citation"
        :to="{ name: 'Article', params: { id: citation.id }}"
      ) 文章
      

  v-row(v-if="content" no-gutters)
    v-col.ellipsis(cols="11")
      strong.text-nowrap.ellipsis {{ content.content.title }}
    v-col(cols="1")
      v-icon.ml-2(small v-if="content.finished") mdi-checkbox-marked-circle
  v-row(
    v-if="content"
    no-gutters
    style="height: 50px;"
  )
    //- p.ma-0(style="white-space: pre-wrap; overflow: hidden;height: 50px;") {{ content.content.body }}
    Body.ma-0(
      style="white-space: pre-wrap; overflow: hidden;height: 50px;"
      :content="content.content.body"
    )
  v-row(v-if="content" no-gutters)
    span.subtitle-2.text--disabled ・{{ content.content.milestones.length }} 個計畫
  //--------- articleBtns 
  ArticleBtns(v-if="content" :content="content")
</template>

<script>
import moment from 'moment';
import color_list from '@/data/color_list';
export default {
  name: 'ArticleCard',
  components: {
    UserAvatar: () => import('@/components/UserAvatar'),
    ArticleBtns: () => import('@/components/ArticleBtns'),
    NavLink: () => import('@/components/NavLink'),
    Body: () => import('@/components/Body'),
  },
  props: {
    id: {
      type: String,
      required: true,
    },
  },
  data: () => ({
    content: undefined,
    color: '#F5F4F0',
    citation: undefined,
  }),
  computed: {
    date() {
      return moment(this.content.date).format('M/D');
    },
  },
  watch: {
    id() {
      this.update();
    },
  },
  created() {
    this.update();
  },
  mounted() {},
  methods: {
    async update() {
      this.color = color_list(this.id);
      let res = await this.$store.dispatch('getArticle', { id: this.id });

      this.content = res;

      if (res.citation)
        this.citation = await this.$store.dispatch('getArticle', {
          id: res.citation,
        });
    },
    goLink() {
      this.$router.push({ name: 'Link', params: { reference: this.content } });
    },
  },
};
</script>

<style scoped>
.my {
  margin-top: 6px;
  margin-bottom: 6px;
}
</style>
