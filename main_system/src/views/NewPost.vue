<template lang="pug">
v-card.ma-0.pa-3(min-height="10vh" rounded="lg" elevation="5")
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
  v-checkbox(v-model='checkbox' label='匿名')
</template>

<script>
import { mapState } from 'vuex';
import { apiUploadArticle } from '@/store/api';
export default {
  name: 'NewPost',
  data: () => ({
    new_article: {
      title: '',
      body: '',
      from: '',
      wishes: '',
    },
    show_info: false,
    info_type: 'success',
    infos: '',
    checkbox: false,
  }),
  computed: {
    ...mapState(['articles']),
  },
  created() {
    let now = new Date(Date.now());
    this.max = now.toISOString().substring(0, 10);
  },
  methods: {
    SubmitNewArticle() {
      this.new_article.wishes = this.max + '\t' + '開始這個願望';
      if (this.checkbox) this.new_article.from = '0';
      else this.new_article.from = this.$store.state.user_id;
      if (!this.new_article.title || !this.new_article.body) {
        // todo : error
        this.Show_info('Blank data!', 'error');
        return;
      }
      apiUploadArticle({
        username: this.checkbox ? 'Unknown' : this.$store.state.username,
        article: this.new_article,
      })
        .then((res) => {
          // TODO : insert new post locally
          let newPostId = res.data;
          this.$store.dispatch('getGlobalArticles', true).then(() => {
            this.$router.push(`/article/${newPostId}`);
          });
        })
        .catch((err) => {
          this.Show_info('Something went wrong', 'error');
          console.log(err);
        });

      this.$store.dispatch('getUserArticles', true);
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
