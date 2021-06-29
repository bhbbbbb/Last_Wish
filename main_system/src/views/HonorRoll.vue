<template lang="pug">
v-sheet.m-view.mt-3(rounded="lg")
  v-row.justify-center(
    no-gutters
    v-if="user_data"
  )
    //- span Level {{ user_data.lv }}
    span {{ user_data.honor }}
  v-row.justify-center(
    no-gutters
    v-if="user_data"
  )
    v-img(
      v-if="user_data && user_data.lv"
      height="226"
      width="226"
      contain
      :src="require(`@/assets/${user_data.lv}.png`)"
    )
  v-row.justify-center(
    no-gutters
    v-if="user_data"
  )
    span 共發起 {{ user_data.n_posts }} 項計畫
  v-row.justify-center.align-end.mt-1(
    no-gutters
    v-if="user_data"
  )
    span.title 已完成
    span.display-1 {{ user_data.n_finished }}
    span.title 項計畫
  v-row.justify-center.align-center(
    no-gutters
  )
    v-img(
      height="70"
      width="70"
      max-width="70"
      contain
      src="@/assets/link.png"
    )
    span(v-if="user_data").px-3 文章被引用 {{ user_data.n_cited }} 次
  v-row.justify-center.align-center(
    no-gutters
  )
    v-img(
      height="70"
      width="70"
      max-width="70"
      contain
      src="@/assets/like.png"
    )
    span(v-if="user_data").px-3 共獲得 {{ user_data.n_liked }} 個讚
</template>

<script>
export default {
  name: 'HonorRoll',

  components: {},
  props: {
    user: {
      required: true,
      type: Object,
    },
  },
  data: () => ({
    user_data: undefined,
  }),
  computed: {},
  watch: {
    user() {
      this.init();
    },
  },
  created() {
    this.init();
  },

  methods: {
    async init() {
      this.user_data = await this.$store.dispatch('user/getUser', {
        id: this.user.id,
        force_update: true,
        more: true,
      });
    },
  },
};
</script>

<style lang="sass" scoped></style>
