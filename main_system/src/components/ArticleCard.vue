<template lang="pug">
v-card.ma-3(min-height="65vh" rounded="lg")
    h2 {{ title }}
    br 

</template>

<script>
  export default {
    name: "ArticleCard",
    props: {
      title: {
        type: String,
        default: "No title",
      },
      content: {
        type: Object,
        required: true,
      }
    }

  }
</script>