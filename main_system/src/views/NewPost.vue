<template lang="pug">
v-card.ma-3.pa-3(min-height="10vh" rounded="lg" elevation="5")
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
</template>

<script>
import {mapState} from 'vuex';
import {apiUploadArticle} from '@/store/api';
export default {
  name: 'NewPost',
  data: () => ({
    new_article: {
      title: '',
      body: '',
      from: '',
    },
  }),
  computed: {
    ...mapState(['articles']),
  },
  methods: {
    SubmitNewArticle() {
      this.new_article.from = this.$store.state.user_id;
      if (!this.new_article.title || !this.new_article.body) {
        // todo : error
        return;
      }
      apiUploadArticle(this.new_article)
        .then((res) => {
          // TODO : insert new post locally
          this.$store.commit('updateGlobalArticles', res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
};
</script>
