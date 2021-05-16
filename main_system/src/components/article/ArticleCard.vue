<template lang="pug">
v-card.my.pa-3(
  min-height="10vh"
  rounded="lg"
  v-on="$listeners"
  :color="color"
)
    h2(style="font-size: 1rem;") {{ content.title }}

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
  }

}
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
