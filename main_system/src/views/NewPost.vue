<template lang="pug">
v-card.ma-0.pa-3(min-height="10vh" flat)
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
  v-text-field(
    style="font-weight: bold;"
    id="tag-input"
    solo
    flat
    autocomplete="off"
    placeholder="#newtag"
    prepend-icon="mdi-plus-circle-outline"
    append-outer-icon="mdi-check"
    v-model="tag_model"
    @focus="addHashTag"
    @blur="removeHashTag"
    @click:prepend="focus()"
    @click:append-outer="addTag()"
    @keydown.enter="addTag()"
    :error-messages="err_msg"
  )
  v-chip.ma-1(
    v-for="(tag, idx) in new_article.tags"
    :key="idx"
    close
    close-icon="mdi-close"
    close-label="刪除"
    color="#9BA2AA"
    small
    dark
    @click:close="removeTag(idx)"
  ) {{ tag }} &nbsp;
  Milestones(:content="new_article.milestones" :author-id="$store.state.user.self.id")
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
import { mapState } from 'vuex';
import { apiUploadArticle } from '@/store/api';
export default {
  name: 'NewPost',
  components: {
    Milestones: () => import('@/components/Milestones'),
  },
  data: () => ({
    new_article: {
      title: '',
      body: '',
      milestones: [],
      tags: [],
    },
    tag_model: '',
    err_msg: undefined,
    show_info: false,
    info_type: 'success',
    infos: '',
    submit_buffer: false,
  }),
  computed: {
    ...mapState(['articles']),
  },
  watch: {
    tag_model(new_val, val) {
      if (new_val.length <= val.length || new_val.length <= 2) return;
      if (new_val && new_val.charAt(new_val.length - 1) === ' ') {
        this.tag_model = this.tag_model.substring(0, new_val.length - 1);
        this.addTag();
      }
    },
  },
  created() {},
  methods: {
    addHashTag() {
      if (!this.tag_model) this.tag_model = '#';
    },
    removeHashTag() {
      if (this.tag_model === '#') this.tag_model = '';
    },
    focus() {
      document.getElementById('tag-input').focus();
    },
    addTag() {
      const no_ws = /\s/g;
      if (no_ws.test(this.tag_model)) {
        this.err_msg = 'contain illegal character';
        return;
      }
      this.new_article.tags.push(this.tag_model);
      this.tag_model = '#';
    },
    removeTag(idx) {
      this.new_article.tags.splice(idx, 1);
    },
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

<style lang="sass" scoped>
$chip-close-size: 12px
</style>
