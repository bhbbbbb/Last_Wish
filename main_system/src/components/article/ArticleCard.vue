<template lang="pug">
v-card.my.pa-3(
    height="170"
    rounded="lg"
    :color="color"
    v-on="$listeners"
  )
  v-row(no-gutters="")
    v-col(cols="5")
      span(v-if="user_info")
        | {{ user_info.username }}
    v-col(cols="5")
      span.subtitle-2.text--disabled {{ content.date }}
    v-col.d-flex.justify-end.pl-2(cols="2")
      | 引用
  v-row(no-gutters="")
    strong {{ content.title }}
  v-row(
    no-gutters
    style="height: 50px;"
  )
    p.ma-0(style="white-space: pre-wrap; overflow: hidden;height: 50px;") {{ content.body }}
  v-row(no-gutters)
    span {{ content.wishes.length }} 個里程碑
  v-row(no-gutters)
    v-btn(icon)
      v-icon mdi-heart-outline
    v-btn(icon)
      v-icon mdi-star-outline
    v-btn(icon)
      v-icon mdi-comment-processing-outline
    
</template>

<script>
export default {
  name: 'ArticleCard',
  props: {
    // title: {
    //   type: String,
    //   default: "No title",
    // },
    content: {
      type: Object,
      required: true,
    },
    color: {
      type: String,
      default: '#F5F4F0',
    },
  },
  data: () => ({
    user_info: undefined,
  }),
  created() {
    this.$store.dispatch('getUser', this.content.from).then((res) => {
      this.user_info = res;
    });
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
