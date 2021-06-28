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
    v-row(no-gutters)
      v-col.d-flex.justify-end.pr-4(cols="1")
        v-tooltip(right open-delay="300")
          template(#activator="{ on, attrs }")
            span.subtitle-2.text--disabled(v-on="on" v-bind="attrs")
              | {{ moment(ms.estDate).format('M/D') }}
          span {{ moment(ms.estDate).format('YYYY/MM/DD') }}
      v-col.d-flex.flex-shrink-1(cols="10")
        span.d-flex.text-no-wrap(style="overflow-x: hidden")
          | {{ ms.title }}
      v-col.d-flex.align-self-start(cols="1")
        v-btn(icon small @click="del(idx)" v-if="editable")
          v-icon(
            small
          ) mdi-close
      //- v-col(offset="1")
      //-   v-icon(v-if="ms.finished" small) mdi-check-circle

  v-timeline-item.align-center(
    small
    :color="color_list(7)"
    v-if="$store.state.user.self.id === authorId && !newMilestone_show"
  )
    v-icon(slot="icon" small color="white") mdi-plus
    v-btn(@click="newMilestone_show = true") 點我新增里程碑
  
  NewMilestone(
    v-if="$store.state.user.self.id === authorId && newMilestone_show"
    @created="addMilestone"
  )

  v-btn(
    v-if="$store.state.user.self.id === authorId && all_fin()"
    rounded
    color ="#D1D7D7"
    depressed
    @click="show = true"
  ) 完成計畫
  MsgBox(:value.sync="show" @confirm="archive" )
    v-col.d-flex.justify-center(cols="12")
      span.align-center(class="msgtxt") 計畫一但完成後就不能再修改
      br
    v-col.d-flex.justify-center(cols="12")
      span.align-center(class="msgtxt") 確定要完成嗎?
</template>

<script>
import moment from 'moment';
import color_list from '@/data/color_list';

export default {
  name: 'Milestones',
  components: {
    NewMilestone: () => import('@/views/NewMilestone'),
    MsgBox: () => import('@/components/MsgBox'),
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
    articleId: {
      type: String,
      required: false,
      default: undefined,
    },
    editable: {
      type: Boolean,
      default: false,
    },
  },
  data: () => ({
    newMilestone_show: true,
    show: false,
  }),
  computed: {},
  created() {},

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
      if (this.editable) this.content.splice(insert_idx, 0, value);
      else {
        this.$store.dispatch('addMilestone', {
          article_id: this.articleId,
          insert_idx,
          milestone: value,
        });
        this.$forceUpdate();
      }
      // this.$emit('update:new', value);
    },
    del(idx) {
      this.content.splice(idx, 1);
    },
    finish(idx) {
      if (this.$store.state.user.self.id === this.authorId && this.articleId)
        this.$store.dispatch('setMilestoneFinished', {
          article_id: this.articleId,
          ms_idx: idx,
          value: !this.content[idx].finished,
        });
      this.$forceUpdate();
    },
    check_display({ idx, hover }) {
      let self = this.content[idx].finished || hover;
      return this.$store.state.user.self.id === this.authorId && self;
    },
    all_fin() {
      let result = true;
      if (this.content.length > 0)
        for (let i = this.content.length - 1; i >= 0; i--) {
          if (!this.content[i].finished) {
            result = false;
            break;
          }
        }
      else result = false;
      //console.log(result);
      return result;
    },
    archive() {
      console.log('fin');
    },
    moment,
    color_list,
  },
};
</script>

<style>
.text-pre-wrap {
  white-space: pre-wrap;
}
</style>

<style scpoed>
.v-timeline-item {
  padding-bottom: 16px !important;
}
</style>
<style scpoed>
.msgtxt {
  font-family: Roboto;
  font-style: medium;
  font-weight: 360;
  line-height: 4px;
  text-align: center;

  color: #888888;
}
</style>
