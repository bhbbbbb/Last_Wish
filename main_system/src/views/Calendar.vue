<template lang="pug">
  v-card.m-view.mt-3(flat)
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
        v-model="selected_date"
        :events="events"
        :event-color="getEventColor"
        @change="updateChange"
        @click:event="toEvent"
      )

    //-------- today event list -----------------
    v-row.justify-center(
      no-gutters
      style="background-color: #D1D7D7;"
    )
      span {{ selected_date }}
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
          @click="repick(idx)"
        )
          div
            v-row(no-gutters).justify-center
              span.caption.text-center {{ getTimeStr(event.start) }}
            v-row(no-gutters).justify-center
              span.caption {{ getTimeStr(event.end) }}

      v-col.d-flex.align-center(cols="7" offset="1" @click="startEdit(idx)")
        v-text-field(
          v-model="name_model"
          v-if="editing === idx"
          @blur="endEdit(idx)"
          id="event-input"
          @keydown.enter="endEdit(idx)"
          hide-details
        )
        span(v-else).text-h6.font-weight-light {{ event.name }}

      
      v-col.d-flex.align-center(cols="2")
        v-btn(
          icon
          outlined
          x-small
          @click="toggleFinish(idx)"
        )
          v-icon(small v-show="$store.getters['user/is_finished'](idx)") mdi-circle
        span.ml-2.subtitle-2 完成
    v-row(no-gutters)
      v-col(cols="2")
        v-sheet.ma-1.d-flex.align-center.justify-center(
          outlined
          :color="picked ? new_event.color : '#ECEEEE'"
          height="50"
          width="60"
        )
          v-btn(v-if="!picked" icon @click="overlay = true")
            v-icon mdi-plus-circle-outline
          div(v-else @click="overlay = true")
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
            v-btn(
              text
              outlined
              small
              @click="addNewEvent"
              :disabled="!picked"
            ) 確認

    //--------- new event overlay #tp ---------------
    TimePicker(
      :value="overlay"
      @cancel="cancelPick"
      @pick="confirmPick"
    )



</template>
<script>
import moment from 'moment';
export default {
  name: 'Calendar',
  components: {
    TimePicker: () => import('@/components/TimePicker'),
  },
  props: {},
  data: () => ({
    title: {
      year: '',
      month: '',
    },
    selected_date: '',
    mounted: false,
    events: [],
    new_event: {
      name: '',
      color: '',
      start: '',
      end: '',
    },
    overlay: false,
    rules: {
      empty: (value) => Boolean(value) || 'required',
    },
    picked: false,
    name_model: undefined,
    editing: undefined,
    doFocus: false,
    repicking: undefined,
  }),
  created() {
    this.$store.dispatch('user/getEvents').then((res) => {
      this.events = res;
    });
  },
  mounted() {
    this.$refs.calendar.checkChange();
    this.mounted = true;
  },
  updated() {
    if (this.doFocus) {
      this.focus();
      this.doFocus = false;
    }
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
      let h = time.getHours();
      if (h < 10) h = '0' + h;
      let m = time.getMinutes();
      if (m < 10) m = '0' + m;
      return `${h}:${m}`;
    },

    addNewEvent() {
      if (!this.new_event.name) throw 'name is blank';
      if (!this.picked) throw 'have to pick time first';
      this.$store.dispatch('user/addEvent', this.new_event);
      this.new_event = {};
      this.picked = false;
    },
    pickForNewEvent(start, end, color) {
      this.new_event.start = new Date(`${this.selected_date}T${start}:00`);
      this.new_event.end = new Date(`${this.selected_date}T${end}:00`);
      this.new_event.color = color;
      this.picked = true;
    },
    confirmPick({ start, end, color }) {
      console.log(start)
      console.log(end)
      if (!this.selected_date) {
        this.selected_date = moment().format('YYYY-MM-DD');
      }
      if (this.repicking) this.endRepick(start, end, color);
      else this.pickForNewEvent(start, end, color);

      this.overlay = false;
    },
    cancelPick() {
      this.overlay = false;
      this.repicking = undefined;
    },
    isTodayEvent(event) {
      if (!this.selected_date) {
        this.selected_date = moment().format('YYYY-MM-DD');
      }
      let tem = moment(event.start).format('YYYY-MM-DD');
      return tem === this.selected_date;
    },
    toggleFinish(idx) {
      this.$store.dispatch('user/toggleEventFinish', idx);
    },
    focus() {
      document.getElementById('event-input').focus();
    },
    startEdit(idx) {
      this.name_model = this.events[idx].name;
      this.editing = idx;
      this.doFocus = true;
    },
    endEdit(idx) {
      this.editing = undefined;
      if (this.name_model === this.events[idx].name) return;
      if (this.name_model && this.name_model.trim())
        this.$store.dispatch('user/editEventName', {
          idx,
          name: this.name_model,
        });
    },
    repick(idx) {
      this.repicking = idx;
      this.overlay = true;
    },
    endRepick(start, end, color) {
      this.$store.dispatch('user/repickEventTime', {
        idx: this.repicking,
        start: new Date(`${this.selected_date}T${start}:00`),
        end: new Date(`${this.selected_date}T${end}:00`),
        color,
      });
      this.repicking = undefined;
    },
    toEvent({ event }) {
      this.selected_date = moment(event.start).format('YYYY-MM-DD');
    },
  },
};
</script>
