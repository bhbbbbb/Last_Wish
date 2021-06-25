<template lang="pug">
v-card.ma-0.pa-3(min-height="10vh" flat)
  EditCard(:article="new_article")
  v-overlay.align-start(
    :value="show_info"
    absolute
    opacity="0"
  )                              
    v-alert.mt-10(:value="show_info" :type="info_type" transition="slide-x-transition") {{infos}}
  v-card-actions.justify-center
    v-btn(@click="SubmitNewArticle()" :disabled="submit_buffer") submit
</template>

<script>
import { apiUploadArticle } from '@/store/api';
export default {
  name: 'NewPost',
  components: {
    EditCard: () => import('@/components/EditCard'),
  },
  data: () => ({
    new_article: {
      title: '',
      body: '',
      milestones: [],
      tags: [],
    },
    show_info: false,
    info_type: 'success',
    infos: '',
    submit_buffer: false,
  }),
  computed: {},
  created() {},
  methods: {
    SubmitNewArticle() {
      if (!this.new_article.title || !this.new_article.body) {
        // todo : error
        this.Show_info('Blank data!', 'error');
        return;
      }
      this.submit_buffer = true;
      apiUploadArticle({
        article_content: this.new_article,
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

      this.$store.dispatch('getSelfArticles', true);
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
