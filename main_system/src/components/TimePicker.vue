<template lang="pug">
v-overlay(
	opacity="0.30"
	:value="value"
)
	v-card.pa-3(
		flat
		height="60vh"
		width="86vw"
		color="white"
		rounded="xl"
		v-click-outside="cancelPicking"
	)
		v-row(no-gutters).justify-center
			span.subtitle-1(style="color: grey") 開始時間
		v-row(no-gutters).justify-center
			date-picker(
				type="time"
				format="HH:mm"
				v-model="pick.start"
				:default-value="new Date().setHours(0, 0)"
				:disabled-time="validStarttime"
				placeholder="select start time"
			)

		v-row(no-gutters).mt-10.justify-center
			span.subtitle-1(style="color: grey") 結束時間
		v-row(no-gutters).justify-center
			date-picker(
				type="time"
				format="HH:mm"
				v-model="pick.end"
				:disabled-time="validEndtime"
				:default-value="new Date().setHours(23, 59)"
				placeholder="select end time"
			)


		v-row(no-gutters).mt-10.justify-center
			span.subtitle-1(style="color: grey") 選擇顏色

		v-row(no-gutters).mt-5.justify-center
			v-item-group(
				mandatory
				v-model="pick.color"
			)
				v-btn.mx-1(
					v-for="(color, idx) in EVENT_COLOR_LIST"
					:key="idx"
					fab
					elevation="0"
					:color="color"
					x-small
					@click="pick.color = idx"
				)
					v-icon(
						v-if="idx === pick.color"
						color="black"
					) mdi-check

		v-row(no-gutters).mt-5.justify-space-between
			v-btn(
				text
				color="grey"
				@click="cancelPicking"
			)
				span 取消
			v-btn(
				text
				color="grey"
				@click="confirmPicking"
			)
				span 確認
</template>
<script>
import { EVENT_COLOR_LIST } from '@/data/color_list';
import DatePicker from 'vue2-datepicker';
import 'vue2-datepicker/index.css';

// import moment from 'moment';
export default {
  name: 'TimePicker',
  components: { DatePicker },
  props: {
    value: {
      type: Boolean,
      required: true,
    },
  },
  data: () => ({
    EVENT_COLOR_LIST,
    pick: {
      start: undefined,
      end: undefined,
      color: 0,
    },
  }),
  created() {
    this.resetPick();
  },
  methods: {
    resetPick() {
      this.pick.start = new Date();
      this.pick.end = new Date();
      this.pick.start.setHours(0, 0);
      this.pick.end.setHours(23, 59);
    },
    cancelPicking() {
      this.$emit('cancel');
    },
    confirmPicking() {
      this.pick.color = EVENT_COLOR_LIST[this.pick.color];
      //The component will return an date obj, following code is used to parse data in specific form
      this.pick.start = this.getTimeStr(this.pick.start);
      this.pick.end = this.getTimeStr(this.pick.end);
      this.$emit('pick', this.pick);
      this.resetPick();
    },
    validEndtime(time) {
      if (this.pick.end < this.pick.start) this.pick.end = this.pick.start;
      return time < this.pick.start;
    },
    validStarttime(time) {
      if (this.pick.end < this.pick.start) this.pick.start = this.pick.end;
      return time > this.pick.end;
    },
    /**
     * @param {Date} Date
     * @returns xx:xx
     */
    getTimeStr(time) {
      let h = time.getHours();
      if (h < 10) h = '0' + h;
      let m = time.getMinutes();
      if (m < 10) m = '0' + m;
      return `${h}:${m}`;
    },
  },
};
</script>
