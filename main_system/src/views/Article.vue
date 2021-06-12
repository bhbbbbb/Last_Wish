<template lang="pug">
v-card.ma-0.pa-1(min-height="80vh", rounded="lg", :color="color_list(id)" width="100%" v-if="context")
  v-container      
    v-row(no-gutters="no-gutters")
      v-col.d-flex.justify-start.align-center(cols="6")
        //- v-icon(@click="followedToggle") {{ hasFollowed ? "mdi-star" : "mdi-star-outline" }}
        UserAvatar(:user="context.author")
        span.py-3.mx-3.text-center.font-weight-bold {{ context.author.name }}
        v-card-subtitle.mx-4.px-4.py-0 {{ date }}
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
    
    //------------ article link from -----------
    v-row(no-gutters)
      v-col(cols="6" offset="1")
        span.caption() 文章引用自 xxxxx


    //------------ title -----------
    v-row.my-3(no-gutters)
      v-col.d-flex.align-center(cols="10" offset="1")
        h3 {{ context.content.title }}
    
    //------------ body -------------
    v-row(no-gutters)
      v-col(cols="10" offset="1")
        p.pre {{ context.content.body }}


    //------------ tags -------------
    v-row(no-gutters)
      v-col(cols="10" offset="1")
        v-chip.mr-2(
          v-for="(tag, idx) in context.content.tags"
          :key="idx"
          color="#9BA2AA"
          small
          dark
        ) {{ tag }}

    //----------- milestone -----------------
    v-row
      v-col.px-8
        //- v-timeline(
        //-   v-if="$store.state.user.id === context.author.id && !newMilestone_show"
        //-   align-top
        //-   dense
        //- )
        v-timeline(
          v-if="!newMilestone_show"
          align-top
          dense
        )
          v-timeline-item(
            v-for="ms in context.content.milestones"
            small
            :color="ms.finished ? '#9BA2AA' : '#C4C4C4'"
            :key="ms._id"
          )
            v-avatar(slot="icon", @click="GoWish(idx)")
            v-row(no-gutters="")
              v-col.d-flex.flex-grow-1
                span.d-flex.text-no-wrap(style="overflow-x: hidden")
                  | {{ ms.title }}
              v-col.d-flex.justify-end.pr-4(cols="auto" slot="opposite")
                span.subtitle-2.text--disabled(slot="opposite")
                  | {{ moment(ms.estDate).format('M/D') }}

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


        //------------------ end milestone ---------------

    v-row.mr-3.mt-5(no-gutters)
      v-col(cols="11" offset="1")
        v-divider
        v-row.align-center(no-gutters)
          v-btn(icon)
            v-icon mdi-heart-outline
          span.subtitle-2.text--secondary 喜歡 {{ context.likes }}
        
          v-btn.ml-3(icon)
            v-icon mdi-comment-processing-outline
          span.subtitle-2.text--secondary 留言 {{ context.comments.length }}

          v-btn.ml-3(icon)
            v-icon mdi-star-outline
          span.subtitle-2.text--secondary 追蹤 {{ context.fans.length }}

        CommentCard(
          v-for="comment in context.comments",
          :key="comment.id",
          :context="comment"
        )
        NewComment(v-if="$store.state.is_login" @update="updateComment")
    v-overlay.align-start(:value="show_info", absolute="absolute", opacity="0")
      v-alert.mt-10(
        :value="show_info",
        :type="info_type",
        transition="slide-x-transition"
      ) {{ infos }}
  
  input#url(style="position: absolute; opacity: 0")
</template>

<script>
import moment from 'moment';
import { apiUserFollowedPostToggle } from '@/store/api';
import color_list from '@/store/color_list.js';
// var Article_id = '';

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
      return moment(this.context.date).format('M/D');
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
    moment,
    color_list,
  },
};
</script>

<style>
.pre {
  white-space: pre-wrap;
}
</style>
