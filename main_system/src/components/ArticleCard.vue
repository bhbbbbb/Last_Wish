<template lang="pug">
v-card.ma-3.pa-3(min-height="10vh" rounded="lg")
    h2 {{ content.title }}
    br 
    
    p.pre {{ content.body }}

</template>

<script>
  export default {
    name: "ArticleCard",
    props: {
      // title: {
      //   type: String,
      //   default: "No title",
      // },
      content: {
        type: Object,
        required: true,
      }
    }

  }
</script>

<style>
.pre {
  white-space: pre-wrap;
}
</style>