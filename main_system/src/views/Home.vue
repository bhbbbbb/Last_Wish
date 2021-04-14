<template lang="pug">
v-main.grey.lighten-3
  v-container
    v-row
      v-col(cols="12" sm="2")
        v-sheet(rounded="lg" min-height="268")
          // 
      v-col(cols="12" sm="8")
        v-sheet(min-height="70vh" rounded="lg")
          ArticleCard(
            v-for="(article, idx) in articles",
            :key="idx"
            :title="article.name_zh"
            :content="article"
          )
            //- span {{idx}} {{article.name_en}}
      v-col(cols="12" sm="2")
        v-sheet(rounded="lg" min-height="268")
          // 
</template>

<script>
// @ is an alias to /src
import ArticleCard from '@/components/ArticleCard.vue'
import { apiGetArticles } from '@/api.js'
// import {mapState} from 'vuex';
export default {
    name: 'Home',
    data: () => ({
      articles: "",
    }),
    components: {
      ArticleCard,
    },
    computed: {
      
    },
    created() {
      apiGetArticles().then((res, err) => {
        this.articles = res.data;
      }).catch(err => {
        console.log(err);
      })
    }
}
</script>
