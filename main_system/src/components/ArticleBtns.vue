<template lang="pug">
v-row.align-center(v-if="content" no-gutters)
	v-col(cols="4")
		v-btn(
			icon
		)
			v-icon mdi-heart-outline
		span.subtitle-2.text--secondary 喜歡 {{ content.likes }}
		
	v-col(cols="4")
		v-btn(
			icon
		)
			v-icon mdi-comment-processing-outline
		span.subtitle-2.text--secondary 留言 {{ content.comments.length }}

	v-col(cols="4")
		v-btn(
			icon
			@click.stop="follow"
			@mousedown.stop=""
		)
			v-icon {{ followed ? 'mdi-star' : 'mdi-star-outline' }}
		span.subtitle-2.text--secondary 追蹤 {{ followed_count }}
</template>

<script>
import { apiToggleFollow } from '@/store/api';
// import color_list from '@/data/color_list';
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
  }),
  created() {
    this.getFollowState();
  },
  methods: {
    getFollowState() {
      const user_id = this.$store.state.user.self.id;
      let found = this.content.fans.find((element) => element === user_id);
      this.followed = Boolean(found);
      this.followed_count = this.content.fans.length;
    },
    follow() {
      this.followed = !this.followed;
      if (this.followed) this.followed_count++;
      else this.followed_count--;
      apiToggleFollow(this.content.id).then(() => {
        this.$store
          .dispatch('getArticle', { id: this.content.id, force_update: true })
          .then(() => {
            this.$store.dispatch('getUserFollowed', true);
          });
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
</style>
