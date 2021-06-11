<template lang="pug">
	v-card(flat)
		v-sheet(height="64") 
			v-row(no-gutters).ma-0
				v-col(cols="1")
					v-btn(
						icon
						@click="$refs.calendar.prev()"
					)
						v-icon mdi-chevron-left
				v-col(cols="10")
					v-row.pt-2.justify-center
						span.caption(v-if="mounted") {{ title.year }}
					v-row.justify-center
						span.h4(v-if="mounted") {{ title.month }}月
				v-col(cols="1")
					v-btn(
						icon
						@click="$refs.calendar.next()"
					)
						v-icon mdi-chevron-right

		v-sheet.mb-3()
			v-calendar(
				ref="calendar"
				type="month"
				v-model="model"
				:events="events"
				:event-color="getEventColor"
				@change="updateChange"
			)

		//-------- today event list -----------------
		v-row.justify-center(
			no-gutters
			style="background-color: #D1D7D7;"
		)
			span {{ model }}
		v-row(
			no-gutters
			v-for="(event, idx) in events"
			:key="idx"
			v-if="isTodayEvent(event)"
		)
			v-col(cols="2")
				v-sheet.ma-1.d-flex.align-center.justify-center(
					outlined
					:color="event.color"
					height="50"
					width="60"
				)
					div
						v-row(no-gutters).justify-center
							span.caption.text-center {{ getTimeStr(event.start) }}
						v-row(no-gutters).justify-center
							span.caption {{ getTimeStr(event.end) }}

			v-col.d-flex.align-center(cols="7" offset="1")
				span.text-h6.font-weight-light {{ event.name }}
			
			v-col.d-flex.align-center(cols="2")
				v-btn(
					icon
					outlined
					x-small
				)
					//- v-icon(small) mdi-circle
				span.ml-2.subtitle-2 完成
		v-row(no-gutters)
			v-col(cols="2")
				v-sheet.ma-1.d-flex.align-center.justify-center(
					outlined
					:color="adding ? COLOR_LIST[color_pick] : '#ECEEEE'"
					height="50"
					width="60"
				)
					v-btn(v-if="!adding" icon @click="startPicking")
						v-icon mdi-plus-circle-outline
					div(v-else)
						v-row(no-gutters).justify-center
							span.caption.text-center {{ getTimeStr(new_event.start) }}
						v-row(no-gutters).justify-center
							span.caption {{ getTimeStr(new_event.end) }}

					
			
			v-col.d-flex.align-center(cols="9" offset="1")
				v-text-field(
					v-model="new_event.name"
					placeholder="新增"
					autocomplete="off"
					solo
					validate-on-blur
					flat
					hide-details="auto"
					:rules="[rules.empty]"
				)
					template(#append-outer)
						v-btn(text outlined small @click="addNewEvent") 確認

		//--------- new event overlay ---------------
		v-overlay(
			opacity="0.30"
			:value="overlay"
		)
			v-card.pa-3(
				flat
				height="60vh"
				width="86vw"
				color="white"
				rounded="xl"
			)
				v-row(no-gutters).justify-center
					span.subtitle-1(style="color: grey") 開始時間
					input(
						type="time"
						v-model="start_pick"
					)

				v-row(no-gutters).mt-5.justify-center
					span.subtitle-1(style="color: grey") 結束時間
					input(
						type="time"
						v-model="end_pick"
					)

				v-row(no-gutters).mt-5.justify-center
					span.subtitle-1(style="color: grey") 選擇顏色

				v-row(no-gutters).mt-5.justify-center
					v-item-group(
						mandatory
						v-model="color_pick"
					)
						v-btn(
							v-for="(color, idx) in COLOR_LIST"
							:key="idx"
							fab
							elevation="0"
							:color="color"
							x-small
							@click="color_pick = idx"
						)
							v-icon(
								v-if="idx === color_pick"
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
import { color_list_by_idx, COLOR_LIST } from '@/store/color_list';
import moment from 'moment';
export default {
  name: 'Calendar',
  props: {},
  data: () => ({
    title: {
      year: '',
      month: '',
    },
    COLOR_LIST,
    model: '',
    mounted: false,
    events: [],
    new_event: {
      name: '',
      color: '',
      start: '',
      end: '',
    },
    start_pick: '00:00',
    end_pick: '23:59',
    color_pick: 0,
    overlay: false,
    rules: {
      empty: (value) => Boolean(value) || 'required',
    },
    adding: false,
  }),
  created() {
    let event = {
      name: 'guitar',
      color: color_list_by_idx(0),
      start: new Date('2021-06-11T13:00:00'),
      end: new Date('2021-06-11T18:00:00'),
    };
    this.events.push(event);
    let event2 = {
      name: '背英文單字',
      color: color_list_by_idx(8),
      start: new Date('2021-06-22T13:00:00'),
      end: new Date('2021-06-22T16:00:00'),
    };
    this.events.push(event2);
  },
  mounted() {
    this.$refs.calendar.checkChange();
    this.mounted = true;
    console.log(this.$refs.calendar);
    // this.title.year = $refs.calendar.times.today.year;
    // this.title.
  },
  methods: {
    updateChange({ start }) {
      this.title.month = start.month;
      this.title.year = start.year;
    },
    getEventColor(event) {
      return event.color;
    },

    /**
     * @param {Object} Date
     * @returns xx:xx
     */
    getTimeStr(time) {
      // time = new Date(time);
      let h = time.getHours();
      if (h < 10) h = '0' + h;
      let m = time.getMinutes();
      if (m < 10) m = '0' + m;
      return `${h}:${m}`;
    },

    addNewEvent() {
      if (!this.new_event.name) throw 'name is blank';
      this.new_event.color = COLOR_LIST[this.color_pick];
      this.events.push(this.new_event);
      this.new_event = {};
      this.color_pick = 0;
      this.start_pick = '00:00';
      this.end_pick = '23:59';
      this.adding = false;
    },
    startPicking() {
      this.overlay = true;
    },
    cancelPicking() {
      this.overlay = false;
    },
    confirmPicking() {
      if (!this.model) {
        this.model = moment().format('YYYY-MM-DD');
      }
      this.new_event.start = new Date(`${this.model}T${this.start_pick}:00`);
      this.new_event.end = new Date(`${this.model}T${this.end_pick}:00`);
      this.overlay = false;
      this.adding = true;
    },
    isTodayEvent(event) {
      if (!this.model) {
        this.model = moment().format('YYYY-MM-DD');
      }
      let tem = moment(event.start).format('YYYY-MM-DD');
      return tem === this.model;
    },
  },
};
</script>
