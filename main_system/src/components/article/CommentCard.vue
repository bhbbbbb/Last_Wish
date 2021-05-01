<template lang="pug">
v-card.ma-3.pa-3.grey.lighten-3(
  v-if="author"
  min-height="10vh"
  rounded="lg"
  v-on="$listeners"
)
  h3
    router-link(
      :to="{name: 'User', params: {username: author.username}}"
    )
      | {{ author.username }}
    
    p {{ context.body }}
    span date : {{ context.date }}
</template>

<script>
import {
  apiGetPublicInfo
} from '@/store/api'
export default {
  name: "CommentCard",

  /*
  comment = {
      "id": "1",
      "date": "abc",
      "body": "this is a comment",
      "from": "0"
  }
  */
  props: {
    context: {
      type: Object,
      required: true,
    }
  },
  data: () => ({
    author: undefined,
  }),

  created() {
    this.getAuthor().then(res => {
      this.author = res.data;
    }).catch(err => {
      console.log(err);
    });
  },
  methods: {
    async getAuthor() {
      return await apiGetPublicInfo(this.context.from);
    }
  }

}
</script>

<style>
.pre {
  white-space: pre-wrap;
}
</style>
