<template lang="pug">
v-sheet.pt-3.sticky(flat style="margin: -5px -5px 5px -5px;")
  v-row.mb-2.pb-1(no-gutters)
    v-menu(
      close-on-content-click
      bottom
      offset-y
    )
      template(#activator="{ on, attrs }")
        v-btn.mr-3(
          v-bind="attrs"
          v-on="on"
          rounded
          height="30"
          elevation="0"
          color="#D1D7D7"
          min-width="120"
        )
          span {{ options[cur_option] }}
          v-icon mdi-menu-down
      
      //- #options
      v-list
        v-list-item(
          key="new2old"
          @click="cur_option = 'new2old'"
          v-if="cur_option !== 'new2old'"
        )
          span {{ options.new2old }}
        v-list-item(
          key="like"
          @click="cur_option = 'like'"
          v-if="cur_option !== 'like'"
        )
          span {{ options.like }}
        v-list-item(
          key="follow"
          @click="cur_option = 'follow'"
          v-if="cur_option !== 'follow'"
        )
          span {{ options.follow }}

    //- #filiter
    v-menu(
      close-on-content-click
      bottom
      offset-y
    )
      template(#activator="{ on, attrs }")
        v-btn(
          rounded
          height="30"
          elevation="0"
          color="#D1D7D7"
          v-on="on"
          v-bind="attrs"
          min-width="100"
        )
          span {{ filiter[cur_filiter] }}
          v-icon mdi-menu-down

      v-list
        v-list-item(
          key="all"
          @click="cur_filiter = 'all'"
          v-if="cur_filiter != 'all'"
        )
          span {{ filiter.all }}
        v-list-item(
          key="finished"
          @click="cur_filiter = 'finished'"
          v-if="cur_filiter != 'finished'"
        )
          span {{ filiter.finished }}
        v-list-item(
          key="unfinished"
          @click="cur_filiter = 'unfinished'"
          v-if="cur_filiter != 'unfinished'"
        )
          span {{ filiter.unfinished }}

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
    options: {
      new2old: '最新發佈',
      like: '讚數',
      follow: '追蹤數',
    },
    cur_option: 'new2old',
    filiter: {
      finished: '已完成',
      unfinished: '未完成',
      all: '全部',
    },
    cur_filiter: 'all',
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
