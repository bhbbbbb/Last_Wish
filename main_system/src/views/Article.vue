<template lang="pug">
v-card.ma-3.pa-3(v-if="NP" min-height="10vh" rounded="lg" elevation="5")
  v-text-field.ma-0.pa-1(placeholder="Title here" v-model="new_article.title")
  v-textarea.ma-0.pa-0( solo auto-grow hint="Write some wishes" placeholder="wishes here" v-model="new_article.wishes")
  v-textarea.ma-0.pa-0(solo="solo" auto-grow="auto-grow" hint="Tell me about your wish" placeholder="body here" v-model="new_article.body")
  v-card-actions.justify-center
    v-btn(@click="Clone") submit
v-card.ma-3.pa-1(v-else="" min-height="80vh" rounded="lg" :color="color")
  v-container
    v-row.flex-column(no-gutters="no-gutters")
      v-menu(offset-y="offset-y" close-on-content-click="close-on-content-click" nudge-left="50")
        template(v-slot:activator="{ on, attrs }")
          v-btn.align-self-end(icon="icon" v-bind="attrs" v-on="on")
            v-icon mdi-dots-horizontal
        v-list
          v-list-item(@click="Copy") 複製連結
          v-list-item(@click="NPT") 加到我的清單
    v-row(no-gutters="no-gutters")
      v-col.d-flex.flex-column.flex-shrink-1.align-center.ma-0(cols="4")
        v-avatar.grey.lighten-1(size="64")
        span.py-3.text-center {{ author.username }}
      v-col.d-flex.justify-center.align-center(cols="8")
        h3 {{ context.title }}
    v-row(no-gutters="no-gutters")
      v-col.my-0(cols="12")
        v-divider
      v-col.py-2.my-0(cols="auto")
        v-card-subtitle.ma-0.px-4.py-0 {{context.date}}
    v-row
      v-col.px-8
        h3(v-for="wish in context.wishes" :key="wish")
          | {{ wish }}
        br
        p.pre {{ context.body }}
        br
        commentcard(v-for="comment in context.comments" :key="comment.id" :context="comment")
    v-overlay.align-start(:value="show_info" absolute="absolute" opacity="0")
      v-alert.mt-10(:value="show_info" :type="info_type" transition="slide-x-transition") {{infos}}
  v-text-field.ma-0.pa-1(placeholder="comment here" v-model="Newcomments")
  v-card-actions.justify-center
    v-btn(@click="SubmitNewComment()") submit
  input#url(style="position: absolute; opacity: 0;")
</template>

<script>
// import { mapState } from 'vuex'
import {apiUploadComment, apiUploadArticle, apiUserPosts} from '@/store/api';

//var Article_id = '';

export default {
  name: 'Article',
  components: {
    CommentCard: () => import('@/components/article/CommentCard'),
  },
  props: {
    id: {
      type: Number,
      required: true,
    },
    context: {
      type: Object,
      required: true,
    },
    color: {
      type: String,
      default: '#F5F4F0',
    },
  },
  data: () => ({
    // context: undefined,
    author: undefined,
    show_info: false,
    info_type: 'success',
    infos: '',
    Newcomments: '',
    new_article: {
      title: '',
      body: '',
      from: '',
      wishes:'',
    },
    NP : false,
  }),
  computed: {
    // ...mapState(['articles']),
    // context() {
    //   console.log(this.context.comments);
    //   return this.articles[this.id];
    // }
  },
  created() {
    this.$store.dispatch('getArticle', this.id).then((res) => {
      this.context = res;
      this.new_article.title = res.title;
      this.new_article.body = res.body;
      this.new_article.wishes = res.wishes;
      this.new_article.wishes = String(this.new_article.wishes).replace(',','\n');
      //Article_id = this.id;
      this.$store.dispatch('getUser', this.context.from).then((res) => {
        this.author = res;
      });
    });
  },

  methods: {
    Copy() {
      let ele = document.getElementById('url');
      ele.value = window.location.href;
      ele.select();
      document.execCommand('copy');
      this.Show_info('Copied', 'success');
    },
    Clone() {
        this.new_article.from = this.$store.state.user_id;
        this.new_article.wishes = this.new_article.wishes.split('\n');
        //new_article.push({title: 'QQ'});
        //Post this article but from is set to user's id
        apiUploadArticle({
          username: this.$store.state.username,
          article: this.new_article,
        })
          .then((res) => {
          this.$store.commit('updateGlobalArticles', res.data);
          this.$store.dispatch('getArticle', this.id).then((res) => {
          this.context = res;
          this.NP = false;
          });
            //Update user_post state
            apiUserPosts({username: this.$store.state.username})
              .then((res) => {
                this.$store.commit('updateUserArticles', res.data);
              })
              .catch((err) => {
                console.log(err);
                this.Show_info('Something went wrong', 'error');
              });
        })
          .catch((err) => {
            console.log(err);
          });
        this.Show_info('posted', 'success');
    },
    SubmitNewComment() {
      apiUploadComment({
        author: {
          name: this.$store.state.username,
          id: this.$store.state.user_id,
        },
        article_id: String(this.id),
        comment: this.Newcomments,
      });
      // console.log(this.context);
      this.context.comments.push({
        body: this.Newcomments,
        date: 'Today',
        from: this.$store.state.user_id,
        id: String(this.context.comments.length),
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
    NPT(){  //New Post True
      this.NP = true;
    },
  },
};
</script>

<style>
.pre {
  white-space: pre-wrap;
}
</style>
