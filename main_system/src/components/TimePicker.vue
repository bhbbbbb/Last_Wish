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
			input(
				type="time"
				v-model="pick.start"
			)

		v-row(no-gutters).mt-5.justify-center
			span.subtitle-1(style="color: grey") 結束時間
			input(
				type="time"
				v-model="pick.end"
			)

		v-row(no-gutters).mt-5.justify-center
			span.subtitle-1(style="color: grey") 選擇顏色

		v-row(no-gutters).mt-5.justify-center
			v-item-group(
				mandatory
				v-model="pick.color"
			)
				v-btn(
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
// import moment from 'moment';
export default {
  name: 'TimePicker',
  props: {
    value: {
      type: Boolean,
      required: true,
    },
  },
  data: () => ({
    EVENT_COLOR_LIST,
    pick: {
      start: '00:00',
      end: '23:59',
      color: 0,
    },
  }),
  created() {},
  methods: {
    cancelPicking() {
      this.$emit('cancel');
    },
    confirmPicking() {
      this.pick.color = EVENT_COLOR_LIST[this.pick.color];
      this.$emit('pick', this.pick);
      this.pick = {
        start: '00:00',
        end: '23:59',
        color: 0,
      };
    },
  },
};
</script>
