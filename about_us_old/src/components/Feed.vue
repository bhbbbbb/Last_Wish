<template lang="pug">
v-container
  v-row
    v-col.pa-1(cols="12")
      slot/
    feed-card(v-for="(memo, idx) in memos" :key="idx" :value="memo")
    
  //- v-row(align="center")
  //-   v-col(cols="3")
  //-     base-btn.ml-0(v-if="page !== 1" square="" title="Previous page" @click="page--")
  //-       v-icon mdi-chevron-left
  //-   v-col.text-center.subheading(cols="6")
  //-     | PAGE {{ page }} OF {{ pages }}
  //-   v-col.text-right(cols="3")
  //-     base-btn.mr-0(v-if="pages > 1 && page < pages" square="" title="Next page" @click="page++")
  //-       v-icon mdi-chevron-right
</template>

<script>
  // Utilities
  import {
    // mapMutations,
    mapState,
  } from 'vuex'

  export default {
    name: 'Feed',

    components: {
      FeedCard: () => import('@/components/FeedCard'),
      
    },

    data: () => ({
      layout: [4,4,4,4,4,4,4,4,4,4,4,4,3,3,3,3,3,3,3,3,3, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6],
      page: 1,
      loc_articles: "",
    }),

    computed: {
      ...mapState(['articles', 'memos']),
      pages () {
        return Math.ceil(this.articles.length / 11)
      },
      // paginatedArticles () {
      //   // const start = (this.page - 1) * 11
      //   // const stop = this.page * 11

      //   // return this.articles.slice(start, stop)
      //   return this.loc_articles.slice(1);
      // },
    },

    watch: {
      page () {
        window.scrollTo(0, 0)
      },
    },

    methods: {
      // ...mapMutations(['flipback']),
      // flip(idx) {
      //   idx++;
      //   if("on_back" in this.loc_articles[idx] && this.loc_articles[idx]["on_back"]) {
      //     // this.$set(this.loc_articles[idx], "hero", this.articles[idx]["hero"])
      //     // console.log("in", this.articles[idx])
      //     this.loc_articles[idx]["hero"] = this.articles[idx]["hero"]
      //     this.loc_articles[idx]["on_back"] = false;
      //   }
      //   else {
      //     //this.$set(this.loc_articles[idx], "hero", "blurcamera.jpg")
      //     this.loc_articles[idx]["hero"] = "blurcamera.jpg"
      //     this.loc_articles[idx]["on_back"] = true;
      //   }
        
      //   // console.log(this.loc_articles[idx]);
      // }
    },
    created() {
      this.loc_articles = JSON.parse(JSON.stringify(this.articles));
      // console.log(this.loc_articles);
    }
  }
</script>
