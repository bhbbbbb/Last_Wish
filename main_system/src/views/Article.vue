<template lang="pug">
v-card.ma-0.pa-1(min-height="80vh", rounded="lg", :color="color_list(id)" width="100%" v-if="context")
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
            //- v-list-item(@click="Clone") 願望拷貝
            v-list-item(@click="GoEdit" v-if="$store.state.user.id === context.author.id") 編輯內文
    v-row(no-gutters="no-gutters")
      v-col.d-flex.flex-column.flex-shrink-1.align-center.ma-0(cols="4")
        //- v-avatar.grey.lighten-1(size="64")
        UserAvatar(:user="context.author")
        span.py-3.text-center {{ context.author.name }}
      v-col.d-flex.justify-center.align-center(cols="8")
        h3 {{ context.content.title }}
    v-row(no-gutters="no-gutters")
      v-col.my-0(cols="12")
        v-divider
      v-col.py-2.my-0(cols="auto")
        v-card-subtitle.ma-0.px-4.py-0 {{ date }}
    v-row
      v-col.px-8
        v-timeline(
          v-if="$store.state.user.id === context.author.id && !newMilestone_show"
          align-top
          dense
        )
          v-timeline-item(
            v-for="(wish, idx) in context.content.milestones"
            small
            :color="color_list(7)"
            :key="idx"
          )
            v-avatar(slot="icon", @click="GoWish(idx)")
            v-row(no-gutters="")
              v-col.d-flex.flex-grow-1
                span.d-flex.text-no-wrap(style="overflow-x: hidden")
                  | {{ wish.title ? wish.title : wish }}
              v-col.d-flex.justify-end.pr-4(cols="auto" slot="opposite")
                span.subtitle-2.text--disabled(slot="opposite")
                  | {{ wish.time ? date_format(wish.time) : "" }}
            //- span.d-flex.text-no-wrap(
            //-   @click="GoWish(idx)" 
            //-   style="overflow-x: hidden;"
            //- ) {{ wish.title ? wish.title : wish }}

          v-timeline-item.align-center(
            small
            :color="color_list(7)"
          )
            v-icon(slot="icon" small color="white" @click="GoNewMilestone") mdi-plus
            v-btn(@click="newMilestone_show = true") 點我新增里程碑
          
        NewMilestone(
          v-if="$store.state.user.id === context.author.id && newMilestone_show"
          :id="id"
          :wishes="context.wishes"
        )
          template(v-slot="newMilestone")

        br
        p.pre {{ context.content.body }}
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
import formatDate from '@/lib/formatDate';
//var Article_id = '';

export default {
  name: 'Article',
  components: {
    CommentCard: () => import('@/components/article/CommentCard'),
    NewComment: () => import('@/components/article/NewComment'),
    NewMilestone: () => import('@/views/NewMilestone'),
    UserAvatar: () => import('@/components/UserAvatar'),
  },
  props: {
    id: {
      type: String,
      required: true,
    },
    // color: {
    //   type: String,
    //   default: '#F5F4F0',
    // },
  },
  data: () => ({
    newMilestone_show: false,
    show_info: false,
    info_type: 'success',
    infos: '',
    ThePost: [],
    NP: false,
    // newMilestone: '',
    hasFollowed: false,
    context: undefined,
  }),
  computed: {
    date() {
      return formatDate(this.context.date);
    },
  },
  created() {
    this.context = this.$store.state.article_data[this.id];
    // this.ThePost = JSON.parse(JSON.stringify(this.context));
    // this.ThePost.wishes = String(this.ThePost.wishes).replace(/,/g, '\n');
    //Article_id = this.id;
    // this.$store.dispatch('getUser', this.context.from).then((res) => {
    //   this.author = res;
    // });
    // if (this.$store.state.followed_articles)
    //   for (var i = 0; i < this.$store.state.followed_articles.length; i++)
    //     if (this.$store.state.followed_articles[i].id == this.context.id) {
    //       this.hasFollowed = true;
    //       break;
    //     }
  },

  methods: {
    date_format(time) {
      let time_arr = time.split('-');
      return time_arr[1] + '/' + time_arr[2];
    },
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
          author: this.context.author,
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
        username: this.$store.state.user.name,
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
