<template lang="pug">
v-sheet.pt-3.sticky(flat style="margin: -5px -5px 5px -5px;")
  v-row.mb-2(no-gutters)
    v-menu(
      v-model="order"
      close-on-content-click
    )
      template(#activator="{ on, attrs }")
        v-btn.mr-3(
          v-bind="attrs"
          v-on="on"
          rounded
          height="30"
          elevation="0"
          color="#D1D7D7"
        )
          span 最新發布
          v-icon mdi-menu-down
    v-menu(
      v-model="completed"
      close-on-content-click
    )
      template(#activator="{ on, attrs }")
        v-btn(
          v-bind="attrs"
          v-on="on"
          rounded
          height="30"
          elevation="0"
          color="#D1D7D7"
        )
          span 已完成
          v-icon mdi-menu-down
    v-btn.ml-auto(
      color="#D1D7D7"
      fab
      elevation="0"
      x-small
      @click="toggleSearchBox"
    )
      v-icon(v-if="!search_box_show") mdi-magnify
      span(v-else) 取消
  v-row(no-gutters style="width: 100%" v-if="search_box_show")
    v-text-field(
      outlined
      rounded
      clearable
      @focus="mode_options_show = true"
      autocomplete="off"
      hide-details
    )
      template(#append-outer)
        span.mt-1.d-flex.text-no-wrap 搜尋

  v-row.pb-1(
    no-gutters
    style="width: 100%;margin-top: -10px;"
    v-if="mode_options_show && search_box_show"
  )
    v-tabs(
      v-model="search_mode"
      color="#9BA2AA"
      background-color="transparent"
      style="width: 100%;"
      mandatory
      grow
    )
      v-tab.align-self-end(value="all" style="min-width: 45px; height: 30px") 全部
      v-tab.align-self-end(value="article" style="min-width: 45px; height: 30px") 文章
      v-tab.align-self-end(value="tag" style="min-width: 45px; height: 30px") 標籤
      v-tab.align-self-end(value="user" style="min-width: 45px; height: 30px") 用戶

</template>

<script>
// import color_list from '@/data/color_list';
export default {
  name: 'Search',

  components: {},
  props: {},
  data: () => ({
    search_box_show: false,
    search_mode: 'all',
    mode_options_show: false,
    order: undefined,
    completed: undefined,
  }),
  computed: {},
  created() {},

  methods: {
    toggleSearchBox() {
      this.search_box_show = !this.search_box_show;
      if (!this.search_box_show) this.mode_options_show = false;
    },
  },
};
</script>

<style lang="sass" scoped>
.sticky
  transform: translatey(-10px)
  position: sticky
  top: 110px
  z-index: 1000
</style>
