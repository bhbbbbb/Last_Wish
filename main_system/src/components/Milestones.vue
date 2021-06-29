<template lang="pug">
v-timeline.ml-n10(
  dense
  align-top
  style="width: 100%; min-width: 300px;"
)
  v-timeline-item(
    v-for="(ms, idx) in content"
    small
    :color="ms.finished ? '#9BA2AA' : '#C4C4C4'"
    :key="idx"
    fill-dot
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
      v-col.ellipsis(cols="11")
        span.text-nowrap.ellipsis(
          style="width: 100%"
          :class="{ 'text-nowrap': !expanded[idx], 'text-pre-wrap': expanded[idx] }"
        )
          | {{ ms.title }}
    v-row(no-gutters v-if="ms.body")
      v-col(cols="1" style="height: 20px;")
        v-icon(
          small
          @click="expand(idx)"
        ) {{ expanded[idx] ? 'mdi-chevron-down' : 'mdi-chevron-right' }}
      v-col.ellipsis(
        cols="11"
        :style="expanded[idx] ? '' : 'height: 20px;'"
      )
        span.caption.ellipsis(
          :class="{ 'text-nowrap': !expanded[idx], 'text-pre-wrap': expanded[idx] }"
        ) {{ ms.body }}

  v-timeline-item.align-center(
    fill-dot
    small
    color="#C4C4C4"
    v-if="$store.state.user.self.id === authorId && !newMilestone_show && !finished"
  )
    v-icon(
      slot="icon"
      small
      color="white"
      @click="newMilestone_show = true"
    ) mdi-plus
    v-btn(
      v-if="$store.state.user.self.id === authorId && allFinish()"
      rounded
      color ="#D1D7D7"
      depressed
      @click="show = true"
    ) 完成計畫
  
  NewMilestone(
    v-if="$store.state.user.self.id === authorId && newMilestone_show && !finished"
    @created="addMilestone"
  )

  v-timeline-item.align-center(
    small
    fill-dot
    color="grey"
    v-else-if="finished"
  )
    v-icon(
      slot="icon"
      small
      color="white"
      @click="newMilestone_show = true"
    ) mdi-check
    strong 計畫於 {{ finished_date }} 完成


  MsgBox(:value.sync="show" @confirm="archive" )
    v-col.d-flex.justify-center(cols="12")
      span.align-center(class="msgtxt") 計畫一但完成後就不能再修改
      br
    v-col.d-flex.justify-center(cols="12")
      span.align-center(class="msgtxt") 確定要完成嗎?
    template(#confirm)
      span(style="color: red") 確定
</template>

<script>
import moment from 'moment';

export default {
  name: 'Milestones',
  components: {
    NewMilestone: () => import('@/views/NewMilestone'),
    MsgBox: () => import('@/components/MsgBox'),
    MilestonesEdit: () => import('@/components/MilestonesEdit'),
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
    finished: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  data: () => ({
    newMilestone_show: false,
    show: false,
    check_show: undefined,
    expanded: {},
  }),
  computed: {
    finished_date() {
      return moment(this.content[this.content.length - 1].estDate).format(
        'MM/DD'
      );
    },
  },
  created() {
    this.check_show = Array(this.content.length).fill(true);
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
      this.$store.dispatch('addMilestone', {
        article_id: this.articleId,
        insert_idx,
        milestone: value,
      });
      this.$forceUpdate();
      // this.$emit('update:new', value);
    },
    del(idx) {
      this.content.splice(idx, 1);
    },
    finish(idx) {
      if (this.finished) return;
      let value = !this.content[idx].finished;
      if (this.$store.state.user.self.id === this.authorId && this.articleId)
        this.$store.dispatch('setMilestoneFinished', {
          article_id: this.articleId,
          ms_idx: idx,
          value,
        });
      this.$forceUpdate();
      if (!value) this.check_show[idx] = false;
      else this.check_show[idx] = true;
    },
    check_display({ idx, hover }) {
      let self = this.content[idx].finished || hover;
      let res = this.$store.state.user.self.id === this.authorId && self;
      if (this.check_show) res = res && this.check_show[idx];
      return res;
    },
    allFinish() {
      let result = true;
      if (this.content.length > 0)
        for (let i = this.content.length - 1; i >= 0; i--) {
          if (!this.content[i].finished) {
            result = false;
            break;
          }
        }
      else result = false;
      return result;
    },
    archive() {
      this.$store.dispatch('finishArticle', { article_id: this.articleId });
    },
    moment,
    expand(idx) {
      if (this.expanded[idx] === undefined) this.$set(this.expanded, idx, true);
      else this.expanded[idx] = !this.expanded[idx];
    },
  },
};
</script>

<style scpoed>
.v-timeline-item {
  padding-bottom: 16px !important;
}
.msgtxt {
  font-family: Roboto;
  font-style: medium;
  font-weight: 360;
  line-height: 4px;
  text-align: center;

  color: #888888;
}
.v-timeline-item__dot--small {
  height: 16px !important;
  width: 16px !important;
}
</style>
