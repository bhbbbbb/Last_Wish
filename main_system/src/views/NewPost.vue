<template lang="pug">
v-card.ma-3.pa-3(min-height="10vh" rounded="lg" elevation="5")
  v-text-field.ma-0.pa-1(
    placeholder="Title here"
    v-model="new_article.title"
  )
  v-textarea.ma-0.pa-0(
    solo
    auto-grow
    hint="Tell me about your wish"
    placeholder="body here"
    v-model="new_article.body"
  )
  v-overlay.align-start(
    :value="show_info"
    absolute
    opacity="0"
  )                              
    v-alert.mt-10(:value="show_info" :type="info_type" transition="slide-x-transition") {{infos}}
  v-card-actions.justify-center
    v-btn(@click="SubmitNewArticle()") submit
</template>

<script>
import {mapState} from 'vuex';
import {apiUploadArticle, apiUserPosts} from '@/store/api';
export default {
  name: 'NewPost',
  data: () => ({
    new_article: {
      title: '',
      body: '',
      from: '',
    },
    show_info: false,
    info_type: 'success',
    infos: '',
  }),
  computed: {
    ...mapState(['articles']),
  },
  methods: {
    SubmitNewArticle() {
      this.new_article.from = this.$store.state.user_id;
      if (!this.new_article.title || !this.new_article.body) {
        // todo : error
        this.Show_info('Blank data!', 'error');
        return;
      }
      apiUploadArticle({
        username: this.$store.state.username,
        article: this.new_article,
      })
        .then((res) => {
          // TODO : insert new post locally
          this.$store.commit('updateGlobalArticles', res.data);
          this.Show_info('Posted', 'success');
        })
        .catch((err) => {
          this.Show_info('Something went wrong', 'error');
          console.log(err);
        });

      apiUserPosts({username: this.$store.state.username})
        .then((res) => {
          this.$store.commit('updateUserArticles', res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    Show_info(Info, infoType) {
      /**
       *There are 4 types of infoType in default:
       *success
       *info
       *warning
       *error
       */
      this.infos = Info;
      this.info_type = infoType;
      this.show_info = true;
      setTimeout(() => {
        this.show_info = false;
      }, 1000);
    },
  },
};
</script>
