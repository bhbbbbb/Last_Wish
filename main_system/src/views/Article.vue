<template lang="pug">
v-card.ma-0.pa-1(min-height="80vh", rounded="lg", :color="color_list(id)" width="100%" v-if="content")
  v-container      
    v-row(no-gutters="no-gutters")
      v-col.d-flex.justify-start.align-center(cols="6")
        //- v-icon(@click="followedToggle") {{ hasFollowed ? "mdi-star" : "mdi-star-outline" }}
        UserAvatar(:user="content.author")
        NavLink(:to="`/${content.author.name}`")
          span.py-3.mx-3.text-center.font-weight-bold {{ content.author.name }}
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
            v-list-item(@click="GoEdit" v-if="$store.state.user.self.id === content.author.id") 編輯內文
    
    //------------ article link from -----------
    v-row(no-gutters)
      v-col(cols="6" offset="1")
        span.caption() 文章引用自 xxxxx


    //------------ title -----------
    v-row.my-3(no-gutters)
      v-col.d-flex.align-center(cols="10" offset="1")
        h3 {{ content.content.title }}
    
    //------------ body -------------
    v-row(no-gutters)
      v-col(cols="10" offset="1")
        Body.text-pre-wrap(:content="content.content.body")


    //------------ tags -------------
    v-row(no-gutters)
      v-col(cols="10" offset="1")
        v-chip.mr-2(
          v-for="(tag, idx) in content.content.tags"
          :key="idx"
          color="#9BA2AA"
          small
          dark
        ) {{ tag }}

    //----------- milestone -----------------
    v-row
      v-col.px-8
        Milestones(:content="content.content.milestones" :author-id="content.author.id")


        //------------------ end milestone ---------------

    v-row.mr-3.mt-5(no-gutters)
      v-col(cols="11" offset="1")
        v-divider
        ArticleBtns(v-if="content" :key="content._id" :content="content")
        CommentCard(
          v-for="(comment, idx) in content.comments",
          :key="idx",
          :content="comment"
        )
        NewComment(
          v-if="$store.state.is_login"
          @update="updateComment"
          :article-id="id"
        )
    v-overlay.align-start(:value="show_info", absolute="absolute", opacity="0")
      v-alert.mt-10(
        :value="show_info",
        :type="info_type",
        transition="slide-x-transition"
      ) {{ infos }}
  
  input#url(style="position: absolute; opacity: 0" disabled)
</template>

<script>
import moment from 'moment';
import color_list from '@/data/color_list';
// var Article_id = '';

export default {
  name: 'Article',
  components: {
    CommentCard: () => import('@/components/article/CommentCard'),
    NewComment: () => import('@/components/article/NewComment'),
    NewMilestone: () => import('@/views/NewMilestone'),
    UserAvatar: () => import('@/components/UserAvatar'),
    ArticleBtns: () => import('@/components/ArticleBtns'),
    NavLink: () => import('@/components/NavLink'),
    Body: () => import('@/components/Body'),
    Milestones: () => import('@/components/Milestones'),
  },
  props: {
    id: {
      type: String,
      required: true,
    },
  },
  data: () => ({
    newMilestone_show: false,
    show_info: false,
    info_type: 'success',
    infos: '',
    ThePost: [],
    NP: false,
    content: undefined,
  }),
  computed: {
    date() {
      return moment(this.content.date).format('M/D');
    },
  },
  created() {
    this.content = this.$store.state.article.data[this.id];
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
          wish: this.content.wishes[idx],
          content: this.content.wishes[idx],
          // color: this.color,
        },
      });
    },
    GoEdit() {
      this.$router.push({
        name: 'ArticleEdit',
        params: {
          id: this.id,
          author: this.content.author,
          content: this.content,
        },
      });
    },
    // GoNewMilestone() {
    //   this.$router.push({
    //     name: 'NewMilestone',
    //     params: {
    //       id: this.id,
    //       wishes: this.content.wishes,
    //     },
    //   });
    // },
    updateComment(newComment) {
      this.content.comments.push(newComment);
    },
    updateMilestone(value) {
      this.content.content.milestones.push(this.value);
      console.log(value);
    },
    moment,
    color_list,
  },
};
</script>

<style scpoed>
.v-timeline-item {
  padding-bottom: 16px !important;
}
</style>
