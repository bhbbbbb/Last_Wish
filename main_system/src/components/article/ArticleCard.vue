<template lang="pug">
v-card.ma-3.pa-3(
  min-height="10vh"
  rounded="lg"
  v-on="$listeners"
  :color="color"
)
    h2 {{ content.title }}

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

<style>
.pre {
  white-space: pre-wrap;
}
</style>
