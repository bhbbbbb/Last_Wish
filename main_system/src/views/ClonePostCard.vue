<template lang="pug">
v-card.ma-3.pa-3(min-height="10vh", rounded="lg", elevation="5")
  v-text-field.ma-0.pa-1(placeholder="Title here", v-model="newArticle.title")
  v-textarea.ma-0.pa-0(
    solo,
    auto-grow,
    hint="Write some wishes",
    placeholder="wishes here",
    v-model="newArticle.wishes"
  )
  v-textarea.ma-0.pa-0(
    solo,
    auto-grow,
    hint="Tell me about your wish",
    placeholder="body here",
    v-model="newArticle.body"
  )
  v-overlay.align-start(:value="show_info", absolute, opacity="0") 
    v-alert.mt-10(
      :value="show_info",
      :type="info_type",
      transition="slide-x-transition"
    ) {{ infos }}
  v-card-actions.justify-center
    v-btn(@click="SubmitNewArticle()") submit
  
  v-checkbox(v-model="checkbox", label="匿名")
</template>

<script>
import { apiUploadArticle, apiGetUserPosts } from '@/store/api';
export default {
  name: 'ClonePostCard',
  props: {
    newArticle: {
      type: Object,
      required: true,
    },
  },
  data: () => ({
    show_info: false,
    info_type: 'success',
    infos: '',
    checkbox: false,
  }),
  computed: {},
  created() {
    this.newArticle.wishes = this.newArticle.wishes.replace(/,/g, '\n');
  },
  methods: {
    SubmitNewArticle() {
      this.newArticle.wishes = this.newArticle.wishes.split('\n');
      if (this.checkbox) this.newArticle.from = '0';
      else this.newArticle.from = this.$store.state.user.id;
      if (!this.newArticle.title || !this.newArticle.body) {
        // todo : error
        this.Show_info('Blank data!', 'error');
        return;
      }
      apiUploadArticle({
        username: this.checkbox ? 'Unknown' : this.$store.state.user.name,
        article: this.newArticle,
      })
        .then((res) => {
          // TODO : insert new post locally
          this.$store.commit('updateGlobalArticles', res.data);
          this.Show_info('Posted', 'success');
          this.newArticle.title = '';
          this.newArticle.body = '';
          this.newArticle.wishes = '';
        })
        .catch((err) => {
          this.Show_info('Something went wrong', 'error');
          console.log(err);
        });

      apiGetUserPosts({ username: this.$store.state.user.name })
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
