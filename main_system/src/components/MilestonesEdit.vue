<template lang="pug">
v-timeline(
  dense
  style="margin-left: -20px"
  align-top
)
  v-timeline-item(
    v-for="(ms, idx) in content"
    small
    :color="ms.finished ? '#9BA2AA' : '#C4C4C4'"
    :key="idx"
  )
    template(#icon)
      v-hover(v-slot="{ hover }")
        v-avatar(
          size="28"
          @click="finish(idx)"
        )
          v-icon(
            v-if="check_display({ idx, hover })"
            small
          ) mdi-check
    v-row.flex-nowrap(no-gutters)
      v-col.d-flex.justify-end.pr-4(cols="1")
        v-tooltip(right open-delay="300")
          template(#activator="{ on, attrs }")
            span.subtitle-2.text--disabled(v-on="on" v-bind="attrs")
              | {{ moment(ms.estDate).format('M/D') }}
          span {{ moment(ms.estDate).format('YYYY/MM/DD') }}
      v-col(cols="10")
        span.d-flex.text-no-wrap(
          v-if="editing_title !== idx"
          style="overflow-x: hidden"
          @click="startTitle(idx)"
          hide-details
        )
          | {{ ms.title }}
        v-text-field.pa-0.ma-0(
          v-else
          placeholder="輸入標題"
          id="title-input"
          v-model="title_model"
          @keydown.enter="endTitle(idx)"
          @blur="endTitle(idx)"
        )
      v-col.d-flex.align-self-start(cols="1")
        v-btn(icon small @click="del(idx)")
          v-icon(
            small
          ) mdi-close
    v-row(no-gutters)
      v-col.d-flex.align-center(
        cols="1"
        style="height: 20px;"
      )
        v-icon(
          small
          @click="expand(idx)"
        ) {{ expanded[idx] ? 'mdi-chevron-down' : 'mdi-chevron-right' }}
      v-col.ellipsis.d-flex.align-center(
        cols="10"
        :style="expanded[idx] ? '' : 'height: 20px;'"
      )
        span.caption(
          v-if="ms.body && editing_body !== idx"
          @click="startBody(idx)"
          :class="{ 'text-nowrap': !expanded[idx], 'text-pre-wrap': expanded[idx] }"
        ) {{ ms.body }}
        v-btn.ma-0.pa-0(
          text
          depressed
          plain
          :ripple="false"
          @click="startBody(idx)"
          v-else-if="!ms.body && editing_body !== idx"
        )
          span.caption +新增註解
        v-textarea.pa-0.ma-0(
          v-else
          placeholder="新增註解"
          id="body-input"
          v-model="body_model"
          @blur="endBody(idx)"
          @keydown.esc="endBody(idx)"
          rows="1"
          auto-grow
          hide-details
        )

  NewMilestone(
    v-if="$store.state.user.self.id === authorId"
    @created="addMilestone"
  )

</template>

<script>
import moment from 'moment';
import color_list from '@/data/color_list';
const MODIFIED = 1,
  NEW = 2;
export default {
  name: 'MilestonesEdit',
  components: {
    NewMilestone: () => import('@/views/NewMilestone'),
  },
  props: {
    content: {
      type: Array,
      required: true,
    },
    authorId: {
      type: String,
      required: true,
    },
  },
  data: () => ({
    editing_body: false,
    editing_title: false,
    try_focus_body: false,
    try_focus_title: false,
    body_model: undefined,
    title_model: undefined,
    expanded: {},
  }),
  computed: {},
  created() {},
  updated() {
    this.doFocus();
  },

  methods: {
    addMilestone(value) {
      let new_date_value = new Date(value.estDate);
      let insert_idx = 0;
      for (let i = this.content.length - 1; i >= 0; i--) {
        let date = this.content[i].estDate;
        if (typeof date === typeof 'string') {
          this.content[i].estDate = new Date(date);
          date = this.content[i].estDate;
        }
        if (date.valueOf() <= new_date_value) {
          insert_idx = i + 1;
          break;
        }
      }

      value.type = NEW;
      this.content.splice(insert_idx, 0, value);
      this.$forceUpdate();
      // this.$emit('update:new', value);
    },
    del(idx) {
      if (this.content[idx].type !== NEW)
        this.$emit('deleted', this.content[idx]._id);
      this.content.splice(idx, 1);
    },
    finish(idx) {
      if (this.content[idx].type !== NEW) {
        this.content[idx].type = MODIFIED;
      }

      this.content[idx].finished = !this.content[idx].finished;
      this.$forceUpdate();
    },
    check_display({ idx, hover }) {
      let self = this.content[idx].finished || hover;
      return this.$store.state.user.self.id === this.authorId && self;
    },
    moment,
    color_list,
    startBody(idx) {
      this.editing_body = idx;
      this.body_model = this.content[idx].body;
      this.try_focus_body = true;
      this.expand(idx, true);
    },
    endBody(idx) {
      this.editing_body = false;
      if (this.body_model && this.content[idx].body !== this.body_model) {
        this.content[idx].body = this.body_model;
        if (this.content[idx].type !== NEW) this.content[idx].type = MODIFIED;
      } else {
        this.expanded[idx] = false;
      }
    },
    startTitle(idx) {
      this.editing_title = idx;
      this.title_model = this.content[idx].title;
      this.try_focus_title = true;
    },
    endTitle(idx) {
      this.editing_title = false;
      if (this.title_model && this.title_model !== this.content[idx].title) {
        this.content[idx].title = this.title_model;
        if (this.content[idx].type !== NEW) this.content[idx].type = MODIFIED;
      }
    },
    doFocus() {
      if (this.try_focus_body) {
        document.getElementById('body-input').focus();
        this.try_focus_body = false;
      } else if (this.try_focus_title) {
        document.getElementById('title-input').focus();
        this.try_focus_title = false;
      }
    },
    expand(idx, value) {
      if (this.expanded[idx] === undefined && value !== false)
        this.$set(this.expanded, idx, true);
      // toggle
      else if (value === undefined) {
        this.expanded[idx] = !this.expanded[idx];
      } else this.expanded[idx] = value;
    },
  },
};
</script>

<style scpoed>
.v-timeline-item {
  padding-bottom: 16px !important;
}
</style>
