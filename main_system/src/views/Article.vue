<template lang="pug">
v-card.ma-3.pa-3(min-height="80vh" rounded="lg" v-if="context")
    h2 {{ context.title }}
    br/
    h3(
      v-for="wish in context.wishes"
      :key="wish"
    ) 
      | {{ wish }}
    br/
    p {{ context.body }}
    br/
    CommentCard(
      v-for="comment in context.comments"
      :key="comment.id"
      :context="comment"
    )
    
      
</template>

<script>
// import { mapState } from 'vuex'
export default {
  name: "Article",
  components: {
    CommentCard: () => import('@/components/article/CommentCard'),
  },
  props: {
    id: {
      type: [Number],
      required: true
    }
  },
  data: () => ({
    context: undefined,
  }),
  computed: {
    // ...mapState(['articles']),
    // context() {
    //   console.log(this.context.comments);
    //   return this.articles[this.id];
    // }
  },
  
  created() {
    this.$store.dispatch('getArticle', this.id).then((res) => {
      this.context = res;
    });
  }

}
</script>

<style>
.pre {
  white-space: pre-wrap;
}
</style>
