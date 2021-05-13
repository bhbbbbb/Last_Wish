<template lang="pug">
ClonePostCard(
      v-if="NP"
      :newArticle="ThePost"
      @Turnback="NPT"
    )
v-card.ma-3.pa-1(v-else="", min-height="80vh", rounded="lg", :color="color")
  v-container
    v-row.flex-column(no-gutters="no-gutters")
      v-menu(
        offset-y="offset-y",
        close-on-content-click="close-on-content-click",
        nudge-left="50"
      )
        template(v-slot:activator="{ on, attrs }")
          v-btn.align-self-end(icon="icon", v-bind="attrs", v-on="on")
            v-icon mdi-dots-horizontal
        v-list
          v-list-item(@click="Copy") 複製連結
          v-list-item(@click="NPT") 願望拷貝
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
        v-card-subtitle.ma-0.px-4.py-0 {{ context.date }}
    v-row
      v-col.px-8
        h3(v-for="wish in context.wishes", :key="wish")
          | {{ wish }}
        br
        p.pre {{ context.body }}
        br
        CommentCard(
          v-for="comment in context.comments",
          :key="comment.id",
          :context="comment"
        )
    v-overlay.align-start(:value="show_info", absolute="absolute", opacity="0")
      v-alert.mt-10(
        :value="show_info",
        :type="info_type",
        transition="slide-x-transition"
      ) {{ infos }}
  v-text-field.ma-0.pa-1(placeholder="comment here", v-model="Newcomments")
  v-card-actions.justify-center
    v-btn(@click="SubmitNewComment()") submit
  input#url(style="position: absolute; opacity: 0")
</template>

<script>
// import { mapState } from 'vuex'
import { apiUploadComment } from '@/store/api';

//var Article_id = '';

export default {
  name: 'Article',
  components: {
    CommentCard: () => import('@/components/article/CommentCard'),
    ClonePostCard: () => import('@/views/ClonePostCard'),
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
    author: {
      id: '',
      username: '',
    },
    show_info: false,
    info_type: 'success',
    infos: '',
    Newcomments: '',
    new_article: {
      title: '',
      body: '',
      from: '',
      wishes: '',
    },
    ThePost:[],
    NP: false,
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
      this.ThePost = JSON.parse(JSON.stringify(res));
      this.ThePost.wishes = String(this.ThePost.wishes).replace(/,/g,'\n');
      //Article_id = this.id;
      this.$store.dispatch('getUser', this.context.from).then((res) => {
        this.author = res;
        console.log(this.author.username);
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
      //new_article.push({title: 'QQ'});
      //Post this article but from is set to user's id
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
      this.Newcomments = '';
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
    NPT() {
      //New Post True
      this.NP = !this.NP;
    },
  },
};
</script>

<style>
.pre {
  white-space: pre-wrap;
}
</style>
