<template lang="pug">
v-card.m-view.pa-1.mt-6.mx-lg-auto(
  min-height="80vh"
  rounded="lg"
  :color="color_list(id)"
  max-width="1000"
  v-if="article"
)
  v-container(style="max-width: 1000px;")      
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
          nudge-left="100"
          min-width="140"
        )
          template(v-slot:activator="{ on, attrs }")
            v-btn.align-self-end(icon, v-bind="attrs", v-on="on")
              v-icon mdi-dots-horizontal
          v-list
            v-list-item(@click="Copy")
              v-icon.mr-2 mdi-content-copy
              span.text-nowrap 複製連結
            //- v-list-item(@click="Clone") 願望拷貝
            v-list-item(
              @click="toggleEdit"
              v-if="$store.state.user.self.id === article.author.id && !article.finished"
            ) 
              v-icon.mr-2 mdi-pencil
              span.text-nowrap {{ editing ? '取消編輯' : '編輯內文' }}


            v-list-item(
              @click="goLink"
              v-if="$store.state.is_login"
            ) 
              v-icon.mr-2 mdi-link-variant
              span.text-nowrap 引用計畫

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
                  v-icon.mr-2 mdi-delete-outline
                  span.text-nowrap(style="color: red") 刪除計畫
              template(#confirm)
                span(style="color: red;") 刪除
              
    
    //------------ article link from -----------
    v-row(v-if="article" no-gutters)
      v-col.pa-0.mt-n2.d-flex.flex-nowrap.align-center(
        offset="1"
        cols="auto"
        style="height: 16px;"
      )
        span.pl-3.ml-3.caption.mr-1(v-show="citation") 引用自
        NavLink.caption.font-weight-bold(
          v-if="citation"
          :to="{ name: 'User', params: { username: citation.author.name }}"
        ) {{ citation.author.name }}
        span.ml-1.caption(v-show="citation") 的
        NavLink.caption.font-weight-bold(
          v-if="citation"
          :to="{ name: 'Article', params: { id: citation.id }}"
        ) 文章
      


    v-row(no-gutters)
      v-col(cols="10" offset="1")
        
        //-- #edit
        EditCard.mt-3(
          v-if="editing"
          :article="article_copy.content"
          @deleted="del_ms"
        )

        v-card.pa-0.ma-0.transparent(flat v-else)
          //------------ #title -----------
          v-row.my-3(no-gutters)
            h3 {{ article.content.title }}
          
          //------------ #body -------------
          v-row(no-gutters)
            v-col(cols="12")
              Body.text-pre-wrap(
                :content="article.content.body"
                markdown
              )


          //------------ #tags -------------
          v-row(no-gutters)
            NavLink(
              v-for="(tag, idx) in article.content.tags"
              :key="idx"
              :underline="false"
              :to="{ name: 'Articles', query: { q: tag.substring(1, tag.length), mode: 2 }}"
            )
              v-chip.mr-2.my-1(
                color="#9BA2AA"
                small
                dark
              ) {{ tag }}

          //----------- #milestone -----------------
          v-row(no-gutters)
            Milestones(
              :content="article.content.milestones"
              :author-id="article.author.id"
              :article-id="article.id"
              :finished="article.finished"
            )
          

          v-row.mr-3.mt-5(no-gutters)
            span.caption 此計畫被引用 {{ article.cited_count }} 次

    //----------- comment -----------------
    v-row.mr-3.mt-5(no-gutters)
      v-col(cols="11" offset="1")
        v-divider
        ArticleBtns(v-if="article" :content="article")
        CommentCard(
          v-for="(comment, idx) in article.comments",
          :key="idx",
          :content="comment",
          :articleId ="id",
          :idx="idx",
        )
        NewComment(
          v-if="$store.state.is_login"
          :article-id="id"
          @created="newComment"
        )
  MsgBox(:value.sync="show_info" :buttons="1" :timeout="1000") 
    v-row(no-gutters)
      v-col.d-flex.justify-center(cols="12")
        span 已複製到剪貼簿
  
  input#url(style="position: absolute; opacity: 0")
</template>

<script>
import moment from 'moment';
import color_list from '@/data/color_list';
const MODIFIED = 1,
  NEW = 2;

export default {
  name: 'Article',
  components: {
    CommentCard: () => import('@/components/article/CommentCard'),
    NewComment: () => import('@/components/article/NewComment'),
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
    deleted_milestones: [],
    citation: undefined,
    article_copy: undefined,
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
  created() {
    this.init();
  },
  methods: {
    async init() {
      if (this.article && this.article.citation)
        this.citation = await this.$store.dispatch('getArticle', {
          id: this.article.citation,
        });
    },
    Copy() {
      let ele = document.getElementById('url');
      ele.value = window.location.href;
      ele.select();
      document.execCommand('copy');
      this.show_info = true;
    },
    newComment() {
      this.$forceUpdate();
    },
    toggleEdit() {
      this.editing = !this.editing;
      if (this.editing) {
        this.article_copy = JSON.parse(JSON.stringify(this.article));
        this.deleted_milestones = [];
      }
      if (!this.editing) {
        // end editing
        this.submitEdit(this.article_copy);
      }
    },
    submitEdit(article) {
      let { new_milestones, modified_milestones } =
        this.milestonesHandle(article);
      this.$store.dispatch('editArticle', {
        article_id: this.id,
        content: {
          title: article.content.title,
          body: article.content.body,
          tags: article.content.tags,
          modified_milestones,
          new_milestones,
          deleted_milestones: this.deleted_milestones,
        },
        content_native: article.content,
      });
    },
    milestonesHandle(article) {
      let new_milestones = [];
      let modified_milestones = [];
      article.content.milestones.forEach((ms) => {
        if (!ms.type) return;
        if (ms.type === NEW) new_milestones.push(ms);
        else if (ms.type === MODIFIED) modified_milestones.push(ms);
      });
      return { new_milestones, modified_milestones };
    },
    del_ms(id) {
      this.deleted_milestones.push(id);
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
