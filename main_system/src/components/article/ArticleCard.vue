<template lang="pug">
v-card.my.pa-3(
    height="185"
    rounded="lg"
    :color="color"
    v-on="$listeners"
    :loading="Boolean(content) ? false : 'grey'"
    :to="{ name: 'Article', params: { id }}"
  )
  v-row(v-if="content" no-gutters="")
    v-col(cols="5" )
      UserAvatar(:user="content.author")
      NavLink(:to="`/${content.author.name}`")
        span.px-3
          | {{ content.author.name }}
    v-col(cols="5")
      span.subtitle-2.text--disabled {{ date }}
    v-col.d-flex.justify-end.pl-2(cols="2")
      v-btn(icon)
        v-icon(style="transform: rotate(0.125turn);") mdi-link
  v-row(v-if="content" no-gutters="")
    strong(style="white-space: nowrap; overflow: hidden;") {{ content.content.title }}
  v-row(
    v-if="content"
    no-gutters
    style="height: 50px;"
  )
    p.ma-0(style="white-space: pre-wrap; overflow: hidden;height: 50px;") {{ content.content.body }}
  v-row(v-if="content" no-gutters)
    span.subtitle-2.text--disabled {{ content.content.milestones.length }} 個里程碑
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
    update() {
      this.color = color_list(this.id);
      this.$store.dispatch('getArticle', { id: this.id }).then((res) => {
        this.content = res;
      });
    },
  },
};
</script>

<style scoped>
.pre {
  white-space: pre-wrap;
}
.my {
  margin-top: 6px;
  margin-bottom: 6px;
}
</style>
