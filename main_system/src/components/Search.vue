<template lang="pug">
v-sheet(rounded="lg")
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
          text
          outlined
          height="30"
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
          text
          outlined
          height="30"
        )
          span 已完成
          v-icon mdi-menu-down
  v-row(no-gutters style="width: 100%")
    v-text-field(
      outlined
      clearable
      append-outer-icon="mdi-magnify"
      @focus="mode_options_show = true"
      autocomplete="off"
    )

  v-row(
    no-gutters
    style="width: 100%;margin-top: -30px;"
    v-show="mode_options_show"
  )
    v-tabs.justify-space-around(
      fixed-tabs
      v-model="search_mode"
      style="width: 100%;"
      mandatory
    )
      v-tab(value="all" height="25px") 全部
      v-tab(value="article" height="25px") 文章
      v-tab(value="tag" height="25px") 標籤
      v-tab(value="user" height="25px") 用戶

</template>

<script>
// import color_list from '@/store/color_list.js';
export default {
  name: 'Search',

  components: {},
  props: {},
  data: () => ({
    search_mode: 'all',
    mode_options_show: false,
    order: undefined,
    completed: undefined,
  }),
  computed: {},
  created() {},

  methods: {},
};
</script>

<style lang="sass" scoped></style>
