<template lang="pug">
v-card.my.pa-3(
    height="185"
    rounded="lg"
    :color="color"
    v-on="$listeners"
    v-if="content"
  )
  v-row(no-gutters="")
    v-col(cols="5")
      UserAvatar(:user="content.author")
      span.px-3()
        | {{ content.author.name }}
    v-col(cols="5")
      span.subtitle-2.text--disabled {{ date }}
    v-col.d-flex.justify-end.pl-2(cols="2")
      v-btn(icon)
        v-icon(style="transform: rotate(0.125turn);") mdi-link
  v-row(no-gutters="")
    strong {{ content.content.title }}
  v-row(
    no-gutters
    style="height: 50px;"
  )
    p.ma-0(style="white-space: pre-wrap; overflow: hidden;height: 50px;") {{ content.content.body }}
  v-row(no-gutters)
    span.subtitle-2.text--disabled {{ content.content.milestones.length }} 個里程碑
  v-row.align-center(no-gutters)
    v-btn(icon)
      v-icon mdi-heart-outline
    span.subtitle-2.text--secondary 喜歡 {{ content.likes }}
    v-btn(icon)
      v-icon mdi-comment-processing-outline
    span.subtitle-2.text--secondary 留言 {{ content.comments.length }}
    v-btn(icon)
      v-icon mdi-star-outline
    span.subtitle-2.text--secondary 追蹤 {{ content.fans.length }}
    
</template>

<script>
import formatDate from '@/lib/formatDate';
export default {
  name: 'ArticleCard',
  components: {
    UserAvatar: () => import('@/components/UserAvatar'),
  },
  props: {
    id: {
      type: String,
      required: true,
    },
    color: {
      type: String,
      default: '#F5F4F0',
    },
  },
  data: () => ({
    content: undefined,
  }),
  computed: {
    date() {
      return formatDate(this.content.date);
    },
  },
  created() {
    this.$store.dispatch('getArticle', this.id).then((res) => {
      this.content = res;
    });
  },
  methods: {},
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
