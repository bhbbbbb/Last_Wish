<template lang="pug">
v-card.unselectable.mx-1.pa-1.my-2.transparent.d-flex.align-center(
  flat
  min-height="48"
  :loading="!author && 'grey'"
)
  UserAvatar(v-if="author" :user="author")
  .px-1
  v-container.pa-0
    v-row(no-gutters)
      NavLink(v-if="author" :to="`/${author.name}`")
        span {{ author.name }}
      .px-2
      Body.mb-0(style="overflow-x: hidden;" :content="content.body")
      v-icon(@click="showInfo" size="small" v-if="$store.state.user.self.id === content.author") mdi-pencil
    v-row(no-gutters)
      span.caption {{ date }}
    MsgBox(:value="show" @confirm="editComment" :buttons="2" @cancel="cancel")
      template(#activator="{ on, attrs }")
      v-text-field(:value="content.body" v-model.lazy="new_comment")

</template>

<script>
import moment from 'moment';
import { apiEditComment } from '@/store/api'
export default {
  name: 'CommentCard',
  components: {
    UserAvatar: () => import('@/components/UserAvatar'),
    NavLink: () => import('@/components/NavLink'),
    Body: () => import('@/components/Body'),
    MsgBox: () => import('@/components/MsgBox'),
  },
  /*
  comment = {
      "id": "1",
      "date": "abc",
      "body": "this is a comment",
      "from": "0"
  }
  */
  props: {
    content: {
      type: Object,
      required: true,
    },
    article_id:{
      type: String,
      required: true,
    }
  },
  data: () => ({
    author: undefined,
    show: false,
    new_comment:undefined,
  }),
  computed: {
    date() {
      return moment(this.content.date).fromNow();
    },
  },

  mounted() {
    this.$store
      .dispatch('user/getUser', { id: this.content.author })
      .then((res) => {
        this.author = res;
      });
    this.new_comment = this.content.body;
  },
  methods: {
    async editComment(){
      this.show = false;
      this.content.body = this.new_comment;
      let res = await apiEditComment(this.article_id, this.content._id, this.new_comment);
      this.content.date = res.data;
    },
    showInfo(){
      this.show = true;
    },
    cancel(){
      this.show = false;
      this.new_comment = this.content.body;
    }
  },
};
</script>

<style>
.unselectable {
  user-select: none;
}
</style>
