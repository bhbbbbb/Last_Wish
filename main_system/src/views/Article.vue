<template lang="pug">
v-card.ma-3.pa-1(min-height="80vh" rounded="lg" v-if="author" :color="color")
  v-container
    v-row.flex-column(no-gutters)
      v-menu(offset-y close-on-content-click nudge-left="50")
        template(v-slot:activator="{ on, attrs }")
          v-btn.align-self-end(
            icon
            v-bind="attrs"
            v-on="on"
          )
            v-icon mdi-dots-horizontal
        v-list(

        )
          v-list-item(@click="Copy") 複製連結
          v-list-item(@click="Clone") 加到我的清單

    v-row(no-gutters)
      v-col.d-flex.flex-column.flex-shrink-1.align-center.ma-0(cols="4")
        v-avatar.grey.lighten-1(size="64")
        span.py-3.text-center {{ author.username }}
      v-col.d-flex.justify-center.align-center(cols="8")
        h3 {{ context.title }}
    v-row(no-gutters)
      v-col.my-0(cols="12")
        v-divider
      v-col.py-2.my-0(cols="auto")
        v-card-subtitle.ma-0.px-4.py-0 {{context.date}}
    v-row
      v-col.px-8 
        h3(
          v-for="wish in context.wishes"
          :key="wish"
        ) 
          | {{ wish }}
        br/
        p.pre {{ context.body }}
        br/
        CommentCard(
          v-for="comment in context.comments"
          :key="comment.id"
          :context="comment"
        )
  v-overlay.align-start(
    :value="overlay"
    absolute
    opacity="0"
  )                              
    v-alert.mt-10(:value="overlay" type="success" transition="slide-x-transition") Copied

  v-overlay.align-start(
    :value="overlay2"
    absolute
    opacity="0"
  )                              
    v-alert.mt-10(:value="overlay2" type="success" transition="slide-x-transition") Cloned  
  input#url(style="position: absolute; opacity: 0;")
  
  v-overlay.align-start(
    :value="overlay3"
    absolute
    opacity="0"
  )                              
    v-alert.mt-10(:value="overlay3" type="error" transition="slide-x-transition") Failed
  input#url(style="position: absolute; opacity: 0;")

  v-text-field.ma-0.pa-1(
    placeholder="comment here"
    v-model="Newcomments"
  )
  v-card-actions.justify-center
    v-btn(@click="SubmitNewComment()") submit
      
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
    overlay: false,
    overlay2: false,
    overlay3: false,
    Newcomments: '',
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
      this.overlay = true;
      setTimeout(() => {
        this.overlay = false;
      }, 1000);
    },
    Clone() {
      console.log(this.context);
      //console.log(this.articles[this.id]);
      if (
        this.$store.state.user_id == '-1' ||
        this.$store.state.user_id == this.author.id
        // TODO : Checkout if user have cloned this wishes before
      ) {
        this.overlay3 = true;
        setTimeout(() => {
          this.overlay3 = false;
        }, 1000);
      } else {
        var new_article = this.context;
        new_article.from = this.$store.state.user_id;
        //new_article.push({title: 'QQ'});
        //Post this article but from is set to user's id
        apiUploadArticle(new_article)
          .then((res) => {
            this.$store.commit('updateGlobalArticles', res.data);
          })
          .catch((err) => {
            console.log(err);
          });
        //Update user_post state
        apiUserPosts({username: this.$store.state.username})
          .then((res) => {
            this.$store.commit('updateUserArticles', res.data);
          })
          .catch((err) => {
            console.log(err);
          });

        this.overlay2 = true;
        setTimeout(() => {
          this.overlay2 = false;
        }, 1000);
      }
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

      console.log(
        this.$store.state.username,
        String(this.id),
        this.Newcomments
      );
    },
  },
};
</script>

<style>
.pre {
  white-space: pre-wrap;
}
</style>
