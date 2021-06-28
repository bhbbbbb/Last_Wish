<template lang="pug">
v-card.m-view.pa-1.mt-6(min-height="80vh", rounded="lg", :color="color_list(id)" min-width="90%" v-if="article")
  v-container      
    v-row(no-gutters="no-gutters")
      v-col.d-flex.justify-start.align-center(cols="6")
        UserAvatar(:user="article.author")
        NavLink(:to="`/${article.author.name}`")
          span.py-3.mx-3.text-center.font-weight-bold {{ article.author.name }}
        v-card-subtitle.mx-4.px-4.py-0 {{ date }}
      v-col.d-flex.justify-end(cols="6")
        v-tooltip(bottom v-if="editing")
          template(#activator="{ on, attrs }")
            v-btn.align-self-end(
              icon
              @click="toggleEdit"
              v-on="on"
              v-bind="attrs"
            )
              v-icon mdi-check
          span 結束編輯
        v-menu(
          v-else
          offset-y,
          close-on-content-click="close-on-content-click",
          nudge-left="50"
        )
          template(v-slot:activator="{ on, attrs }")
            v-btn.align-self-end(icon, v-bind="attrs", v-on="on")
              v-icon mdi-dots-horizontal
          v-list
            v-list-item(@click="Copy") 複製連結
            //- v-list-item(@click="Clone") 願望拷貝
            v-list-item(
              @click="toggleEdit"
              v-if="$store.state.user.self.id === article.author.id"
            ) {{ editing ? '取消編輯' : '編輯內文' }}


            v-list-item(
              @click="goLink"
              v-if="$store.state.is_login"
            ) 引用計畫

            v-divider.mx-2(
              v-if="$store.state.user.self.id === article.author.id"
            )

            //- v-dialog
            MsgBox(
              @confirm="deletePost"
              width="320"
              v-if="$store.state.user.self.id === article.author.id"
            )
              span 讓口卡獸把這篇文章吃掉嗎？
              template(#activator="{ on, attrs }")
                v-list-item(
                  style="color: red"
                  v-on="on"
                  v-bind="attrs"
                ) 
                  v-list-item-title(style="color: red") 刪除計畫
              template(#confirm)
                span(style="color: red;") 刪除
              
    
    //------------ article link from -----------
    v-row(no-gutters)
      v-col(cols="6" offset="1")
        span.caption() 文章引用自 xxxxx


    v-row(no-gutters)
      v-col(cols="10" offset="1")
        
        //-- #edit
        EditCard.mt-3(v-if="editing" :article.sync="article.content")

        v-card.pa-0.ma-0.transparent(flat v-else)
          //------------ #title -----------
          v-row.my-3(no-gutters)
            h3 {{ article.content.title }}
          
          //------------ #body -------------
          v-row(no-gutters)
            v-col(cols="12")
              Body.text-pre-wrap(:content="article.content.body")


          //------------ #tags -------------
          v-row(no-gutters)
            v-chip.mr-2.my-1(
              v-for="(tag, idx) in article.content.tags"
              :key="idx"
              color="#9BA2AA"
              small
              dark
            ) {{ tag }}

          //----------- #milestone -----------------
          v-row
            Milestones(
              :content="article.content.milestones"
              :author-id="article.author.id"
              :article-id="article.id"
            )



    //----------- comment -----------------
    v-row.mr-3.mt-5(no-gutters)
      v-col(cols="11" offset="1")
        v-divider
        ArticleBtns(v-if="article" :content="article")
        CommentCard(
          v-for="(comment, idx) in article.comments",
          :key="idx",
          :content="comment"
        )
        NewComment(
          v-if="$store.state.is_login"
          :article-id="id"
        )
  MsgBox(:value.sync="show_info" :buttons="1" :timeout="1000") 
    v-row(no-gutters)
      v-col.d-flex.justify-center(cols="12")
        span 已複製到剪貼簿
  
  input#url(style="position: absolute; opacity: 0" disabled)
</template>

<script>
import moment from 'moment';
import color_list from '@/data/color_list';

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
    MsgBox: () => import('@/components/MsgBox'),
    EditCard: () => import('@/components/EditCard'),
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
    editing: false,
  }),
  computed: {
    date() {
      return moment(this.article.date).format('M/D');
    },
    article: {
      get() {
        return this.$store.state.article.data[this.id];
      },
      set(val) {
        this.$store.dispatch('editArticle', {
          article_id: this.id,
          content: val.content,
        });
      },
    },
  },
  created() {},

  methods: {
    Copy() {
      let ele = document.getElementById('url');
      ele.value = window.location.href;
      ele.select();
      document.execCommand('copy');
      this.Show_info('已複製到剪貼簿');
      this.show_info = true;
    },
    toggleEdit() {
      this.editing = !this.editing;
      if (!this.editing) {
        // end editing
        this.submitEdit();
      }
    },
    submitEdit() {
      this.$store.dispatch('editArticle', {
        article_id: this.id,
        content: this.article.content,
      });
    },
    moment,
    color_list,
    deletePost() {
      this.$store.dispatch('deleteArticle', this.id);
      this.$router.replace('/');
    },
    goLink() {
      this.$router.push({ name: 'Link', params: { reference: this.article } });
    },
  },
};
</script>

<style scpoed>
.v-timeline-item {
  padding-bottom: 16px !important;
}
</style>
