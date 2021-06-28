<template lang="pug">
v-row.align-center(v-if="content" no-gutters)
  v-col.d-flex.flex-nowrap.align-center(cols="4")
    v-btn(
      icon
      :disabled="!$store.state.is_login"
      @click.stop.prevent="like"
      @mousedown.stop=""
      @touchstart.stop=""
    )
      v-icon {{ liked ? 'mdi-heart' : 'mdi-heart-outline' }}
    span.subtitle-2.text--secondary.text-nowrap 喜歡 {{ liked_count }}
    
  v-col.d-flex.flex-nowrap.align-center(cols="4")
    v-btn(
      icon
      :disabled="!$store.state.is_login"
    )
      //- v-icon mdi-comment-processing-outline
      v-icon far fa-comment
    span.subtitle-2.text--secondary.text-nowrap 留言 {{ content.comments.length }}

  v-col.d-flex.flex-nowrap.align-center(cols="4")
    v-btn(
      icon
      :disabled="!$store.state.is_login"
      @click.stop.prevent="follow"
      @mousedown.stop=""
      @touchstart.stop=""
    )
      v-icon {{ followed ? 'mdi-star' : 'mdi-star-outline' }}
    span.subtitle-2.text--secondary.text-nowrap 追蹤 {{ followed_count }}
</template>

<script>
// import { apiToggleFollow, apiToggleLike } from '@/store/api';
// import { apiSetFollow, apiSetLike } from '@/store/api';
import { apiSetLike } from '@/store/api';
export default {
  name: 'ArticleBtns',
  components: {},
  props: {
    content: {
      type: Object,
      required: true,
    },
  },
  data: () => ({
    followed: false,
    followed_count: undefined,
    liked: false,
    liked_count: undefined,
  }),
  watch: {
    content() {
      this.init();
    },
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      this.getFollowState();
      this.getLikeState();
    },
    getFollowState() {
      const user_id = this.$store.state.user.self.id;
      this.followed = this.content.fans.includes(user_id);
      this.followed_count = this.content.fans.length;
    },
    follow() {
      if (!this.$store.state.is_login) return;
      this.followed = !this.followed;
      if (this.followed) this.followed_count++;
      else this.followed_count--;
    
      this.$store.dispatch('setFollowed', {
        article_id: this.content.id,
        value: this.followed
      });
      // apiSetFollow(this.content.id, this.followed).then(() => {
      //   this.$store
      //     .dispatch('getArticle', { id: this.content.id, force_update: true })
      //     .then(() => {
      //       this.$store.dispatch('getFollowedArticles', true);
      //     });
      // });
    },
    getLikeState() {
      this.liked = !!this.$store.state.article.liked[this.content.id];
      this.liked_count = this.content.likes;
    },
    like() {
      if (!this.$store.state.is_login) return;
      this.liked = !this.liked;
      if (this.liked) this.liked_count++;
      else this.liked_count--;
      apiSetLike(this.content.id, this.liked);
      this.$store.commit('setLiked', {
        id: this.content.id,
        value: this.liked,
      });
    },
  },
};
</script>
<style>
.btns_text {
  font-family: Roboto;
  font-style: normal;
  font-weight: 300;
  font-size: 8px;
  line-height: 9px;

  color: #888888;
}
/* .text-nowrap {
  white-space: nowrap;
} */
</style>
