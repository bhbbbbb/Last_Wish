<template lang="pug">
v-timeline-item.align-center(small :color="color_list(7)" style="padding-top: 12px")
  v-icon(slot="icon" small color="white")  mdi-plus 

  v-row(no-gutters)
    v-col.d-flex.justify-end.align-center.ml-5(cols="1")
      v-menu(
        v-model="menu"
        :close-on-content-click="false"
        transition="scale-transition"
        min-width="auto"
        offset-y
      )
        template(#activator="{ on, attrs }")
          v-btn.pa-0(
            text
            v-on="on"
            v-bind="attrs"
          )
            span.subtitle-2.text--disabled() {{ date_modified ? selected_date : '選擇日期' }}
            v-icon(small) mdi-chevron-down

        v-date-picker(
          no-title
          v-model="newMilestone.estDate"
          :color="color_list(7)"
          @change="date_modified = true"
        )

    v-col.flex-shrink-1(cols="8" offset="1")
      v-text-field(
        v-model="title"
        append-icon="mdi-check"
        @click:append="submit"
        @keydown.enter="submit"
        :error-messages="err_msg"
        placeholder="新增里程碑"
      )
  //- v-row
  //-   v-col.d-flex.justify-center(cols="12")
  //-     v-date-picker(v-model="newMilestone.estDate" :color="color_list(7)" :max="max")
  //-   v-col.d-flex.justify-center(cols="12")
  //-     v-btn(@click="submitMilestone")  submit 
  slot(:newmilestone="newMilestone")
</template>

<script>
// import { apiUploadMilestone } from '@/store/api';
import color_list from '@/data/color_list';
import moment from 'moment';
export default {
  name: 'NewMilestone',
  components: {},
  props: {},
  data: () => ({
    newMilestone: {
      title: undefined,
      estDate: undefined,
      body: undefined,
      finished: false,
    },
    title: undefined,
    max: undefined,
    calendar_show: false,
    menu: false,
    date_modified: false,
    err_msg: undefined,
  }),
  computed: {
    selected_date() {
      return moment(this.newMilestone.estDate).format('M/D');
    },
  },
  watch: {
    title() {
      this.err_msg = undefined;
    },
  },
  created() {
    this.max = this.getISONow();
    this.newMilestone.estDate = this.max;
  },

  methods: {
    getISONow() {
      return moment().format('YYYY-MM-DD');
    },
    date_format(time) {
      let time_arr = time.split('-');
      return time_arr[1] + '/' + time_arr[2];
    },
    color_list,
    moment,
    submit() {
      // TODO : tell user error message
      if (!this.date_modified) {
        this.err_msg = '請選擇日期';
        return;
      }
      if (!this.title || !this.title.trim()) {
        this.err_msg = '不得為空';
        return;
      }

      this.newMilestone.title = this.title;
      let copy = JSON.parse(JSON.stringify(this.newMilestone));
      this.$emit('created', copy);
      this.newMilestone.title = undefined;
      this.newMilestone.estDate = undefined;
      this.newMilestone.body = undefined;
      this.title = undefined;
      this.date_modified = false;
    },
  },
};
</script>

<style scpoed>
/* .v-timeline-item {
  padding-bottom: 12px !important;
} */
</style>
