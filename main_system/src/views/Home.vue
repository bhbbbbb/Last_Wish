<template lang="pug">
v-main.grey.lighten-3
  v-container
    v-row
      v-col(cols="12" sm="2")
        v-sheet(rounded="lg" min-height="268")
          // 
      v-col(cols="12" sm="8")
        v-sheet(min-height="70vh" rounded="lg")
          v-col(cols="12")
            v-card.ma-3.pa-3(min-height="10vh" rounded="lg")
              v-text-field.ma-0.pa-1(
                placeholder="Title here"
                v-model="new_article.title"
              )
              v-textarea.ma-0.pa-0(
                solo
                auto-grow
                hint="haha"
                placeholder="body here"
                v-model="new_article.body"
              )
              v-card-actions.justify-center
                v-btn(@click="SubmitNewArticle()") submit
            
          v-col(
            cols="12"
            v-for="(article, idx) in articles",
            :key="idx"
          )
            ArticleCard(
              :content="article"
            )
            
      v-col(cols="12" sm="2")
        v-sheet(rounded="lg" min-height="268")
          // 
</template>

<script>
// @ is an alias to /src
import ArticleCard from '@/components/ArticleCard.vue'
import {mapState} from 'vuex';
import {apiUploadArticle} from '@/store/api'
export default {
    name: 'Home',
    data: () => ({
      content: {
        body: "test\r\ntet"
      },
      new_article: {
        title: "",
        body: "",
      }
    }),
    components: {
      ArticleCard,
    },
    computed: {
      ...mapState(['articles']),
    },
    methods: {
      SubmitNewArticle() {
        if (!this.new_article.title || !this.new_article.body) {
          // todo : error
          return;
        }
        apiUploadArticle(this.new_article).then(res => {
          this.$store.commit('updateData', res.data);
        }).catch(err => {
          console.log(err)
        });

        console.log(this.articles);
      }
    },
    created() {

      // without running 'getData' the articles would be blank
      this.$store.dispatch('getData');
    }
}
</script>
