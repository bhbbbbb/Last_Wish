<template lang="pug">
v-card.ma-0.pa-1(min-height="80vh", rounded="lg", :color="color_list(id)" width="100%")
  v-container      
    v-row(no-gutters="no-gutters")
      v-col.d-flex.justify-start(cols="6")
        v-icon(@click="followedToggle") {{ hasFollowed ? "mdi-star" : "mdi-star-outline" }}
      v-col.d-flex.justify-end(cols="6")
        v-menu(
          offset-y,
          close-on-content-click="close-on-content-click",
          nudge-left="50"
        )
          template(v-slot:activator="{ on, attrs }")
            v-btn.align-self-end(icon="icon", v-bind="attrs", v-on="on")
              v-icon mdi-dots-horizontal
          v-list
            v-list-item(@click="Copy") 複製連結
            v-list-item(@click="Clone") 願望拷貝
            v-list-item(@click="GoEdit" v-if="$store.state.user_id === author.id") 編輯內文
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
        v-timeline(
          align-top
          dense
        )
          v-timeline-item(
            v-for="(wish, idx) in context.wishes"
            small
            :color="color_list(7)"
            :key="idx"
          )
            v-avatar(slot="icon", @click="GoWish(idx)")
            span.d-flex.text-no-wrap(
              @click="GoWish(idx)" 
              style="overflow-x: hidden;"
            ) {{ wish }}

          v-timeline-item.align-center(
            v-if="$store.state.user_id === author.id"
            small
            :color="color_list(7)"
          )
            v-icon(slot="icon" small color="white" @click="GoNewMilestone") mdi-plus
            v-btn(@click="GoNewMilestone") 點我新增里程碑
            //- v-text-field.ma-0.pa-1(placeholder="新增里程碑" v-model="newMilestone" @keydown.enter="submitMilestone")
        br
        p.pre {{ context.body }}
        br
        CommentCard(
          v-for="comment in context.comments",
          :key="comment.id",
          :context="comment"
        )
        NewComment(@update="updateComment")

    v-overlay.align-start(:value="show_info", absolute="absolute", opacity="0")
      v-alert.mt-10(
        :value="show_info",
        :type="info_type",
        transition="slide-x-transition"
      ) {{ infos }}
  
  input#url(style="position: absolute; opacity: 0")
</template>

<script>
// import { mapState } from 'vuex'
import { apiUserFollowedPostToggle } from '@/store/api';
import color_list from '@/store/color_list.js';
//var Article_id = '';

export default {
  name: 'Article',
  components: {
    CommentCard: () => import('@/components/article/CommentCard'),
    NewComment: () => import('@/components/article/NewComment'),
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
    // color: {
    //   type: String,
    //   default: '#F5F4F0',
    // },
  },
  data: () => ({
    author: {
      id: '',
      username: '',
    },
    show_info: false,
    info_type: 'success',
    infos: '',
    ThePost: [],
    NP: false,
    // newMilestone: '',
    hasFollowed: false,
  }),
  computed: {},
  created() {
    this.ThePost = JSON.parse(JSON.stringify(this.context));
    this.ThePost.wishes = String(this.ThePost.wishes).replace(/,/g, '\n');
    //Article_id = this.id;
    this.$store.dispatch('getUser', this.context.from).then((res) => {
      this.author = res;
    });

    if (this.$store.state.followed_articles)
      for (var i = 0; i < this.$store.state.followed_articles.length; i++)
        if (this.$store.state.followed_articles[i].id == this.context.id) {
          this.hasFollowed = true;
          break;
        }
  },

  methods: {
    Copy() {
      let ele = document.getElementById('url');
      ele.value = window.location.href;
      ele.select();
      document.execCommand('copy');
      this.Show_info('Copied', 'success');
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
    Clone() {
      this.$router.push({
        name: 'ArticleClone',
        params: {
          id: this.id,
          newArticle: this.ThePost,
        },
      });
    },
    GoWish(idx) {
      this.$router.push({
        name: 'Wish',
        params: {
          id: this.id,
          wish: this.context.wishes[idx],
          context: this.context.wishes[idx],
          // color: this.color,
        },
      });
    },
    GoEdit() {
      this.$router.push({
        name: 'ArticleEdit',
        params: {
          id: this.id,
          author: this.author,
          context: this.context,
        },
      });
    },
    GoNewMilestone() {
      this.$router.push({
        name: 'NewMilestone',
        params: {
          id: this.id,
          wishes: this.context.wishes,
        },
      });
    },
    updateComment(newComment) {
      this.context.comments.push(newComment);
    },
    followedToggle() {
      apiUserFollowedPostToggle({
        username: this.$store.state.username,
        articleId: String(this.id),
      }).then(() => {
        this.$store.dispatch('getUserFollowed');
        this.hasFollowed = !this.hasFollowed;
      });
    },
    color_list,
  },
};
</script>

<style>
.pre {
  white-space: pre-wrap;
}
</style>
