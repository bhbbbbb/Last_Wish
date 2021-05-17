<template>
  <ArticleContainer
    v-if="articles"
    :articles="articles"
  />
</template>

<script>
import {apiUserFollowedPosts} from '@/store/api';
export default {
  name: 'App',
  components: {
    ArticleContainer: () => import('@/views/ArticleContainer')
  },
  data: () => ({
    articles: undefined
  }),
  computed: {
  },
  created() {
    apiUserFollowedPosts({username:this.$store.state.username})
    .then(res=>{
    this.articles = res.data;
    })
  }
};
</script>
