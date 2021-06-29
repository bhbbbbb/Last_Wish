<template lang="pug">
v-sheet.pt-3.sticky(flat style="margin: -8px -5px 5px -5px;")
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
          span {{ options[sort_by] }}
          v-icon mdi-menu-down
      
      //- #options #sort_by
      v-list
        v-list-item-group(v-model="sort_by")
          v-list-item(
            value="new2old"
            @click="sort_by = 'new2old'"
            v-if="sort_by !== 'new2old'"
          )
            span {{ options.new2old }}
          v-list-item(
            value="most_liked"
            @click="sort_by = 'most_liked'"
            v-if="sort_by !== 'most_liked'"
          )
            span {{ options.most_liked }}
          v-list-item(
            value="most_followed"
            @click="sort_by = 'most_followed'"
            v-if="sort_by !== 'most_followed'"
          )
            span {{ options.most_followed }}
          v-list-item(
            value="default"
            @click="sort_by = 'default'"
            v-if="sort_by !== 'default' && input_model"
          )
            span {{ options.default }}

    //- #filter
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
          span {{ filter_options[filter] }}
          v-icon mdi-menu-down

      v-list
        v-list-item-group(v-model="filter")
          v-list-item(
            value="all"
            @click="filter = 'all'"
            v-if="filter != 'all'"
          )
            span {{ filter_options.all }}
          v-list-item(
            value="finished"
            @click="filter = 'finished'"
            v-if="filter != 'finished'"
          )
            span {{ filter_options.finished }}
          v-list-item(
            value="unfinished"
            @click="filter = 'unfinished'"
            v-if="filter != 'unfinished'"
          )
            span {{ filter_options.unfinished }}

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
    //-- #search
    v-text-field(
      outlined
      rounded
      clearable
      @focus="focus"
      @blur="blur"
      autocomplete="off"
      hide-details
      v-model="input_model"
      id="search-input"
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
// const ALL = 0, ARTICLES = 1, TAGS = 2, USER = 3;
export default {
  name: 'Search',

  components: {},
  props: {
    value: {
      required: false,
      type: [String],
      default: undefined,
    },
    mode: {
      required: true,
      type: Number,
    },
    s: {
      type: String,
      required: true,
    },
    f: {
      type: String,
      required: true,
    },
  },
  data: () => ({
    search_box_show: false,
    mode_options_show: false,
    options: {
      new2old: '最新發佈',
      most_liked: '讚數',
      most_followed: '追蹤數',
      default: '相關性',
    },
    filter_options: {
      finished: '已完成',
      unfinished: '未完成',
      all: '全部',
    },
    try_focus: false,
    sort_by_modified_after_input: false,
  }),
  computed: {
    input_model: {
      get() {
        return this.value;
      },
      set(val) {
        if (val && !this.sort_by_modified_after_input) this.sort_by = 'default';
        if (!val) {
          if (this.sort_by === 'default') this.sort_by = 'new2old';
        }
        this.$emit('update:value', val);
      },
    },
    search_mode: {
      get() {
        return this.mode;
      },
      set(val) {
        this.$emit('update:mode', val);
      },
    },
    sort_by: {
      get() {
        return this.s;
      },
      set(val) {
        this.$emit('update:s', val);
      },
    },
    filter: {
      get() {
        return this.f;
      },
      set(val) {
        this.$emit('update:f', val);
      },
    },
  },
  watch: {
    sort_by() {
      if (this.input_model) this.sort_by_modified_after_input = true;
      this.$emit('update', { sort_by: this.sort_by, filter: this.filter });
    },
    filter() {
      this.$emit('update', { sort_by: this.sort_by, filter: this.filter });
    },
    search_mode() {
      this.$emit('update:value', this.input_model);
    },
  },
  created() {
    if (this.value) {
      this.search_box_show = true;
      this.mode_options_show = true;
    }
  },
  updated() {
    this.doFocus();
  },

  methods: {
    toggleSearchBox() {
      this.search_box_show = !this.search_box_show;
      if (!this.search_box_show) this.cancel();
      else this.try_focus = true;
    },
    focus() {
      this.mode_options_show = true;
      this.$emit('focus');
    },
    blur() {
      // if (!this.input_model) {
      //   this.cancel();
      //   this.search_box_show = false;
      // }
      this.$emit('blur');
    },
    cancel() {
      this.mode_options_show = false;
      this.sort_by_modified_after_input = false;
      this.input_model = '';
      this.$emit('cancel');
    },
    doFocus() {
      if (this.try_focus) {
        document.getElementById('search-input').focus();
        this.try_focus = false;
      }
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
