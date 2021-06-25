<template lang="pug">
v-timeline(
	align-top
	dense
	style="margin-left: -20px"
)
	v-timeline-item(
		v-for="(ms, idx) in content"
		small
		:color="ms.finished ? '#9BA2AA' : '#C4C4C4'"
		:key="idx"
	)
		v-avatar(slot="icon", @click="gowish(idx)")
		v-row(no-gutters="")
			v-col.d-flex.justify-end.pr-4(cols="1")
				span.subtitle-2.text--disabled()
					| {{ moment(ms.estDate).format('M/D') }}
			v-col.d-flex.flex-shrink-1(cols="auto")
				span.d-flex.text-no-wrap(style="overflow-x: hidden")
					| {{ ms.title }}
			v-col(offset="1")
				v-icon(v-if="ms.finished" small) mdi-check-circle

	v-timeline-item.align-center(
		small
		:color="color_list(7)"
		v-if="$store.state.user.self.id === authorId && !newMilestone_show"
	)
		v-icon(slot="icon" small color="white") mdi-plus
		v-btn(@click="newMilestone_show = true") 點我新增里程碑
	
	NewMilestone(
		v-if="$store.state.user.self.id === authorId && newMilestone_show"
		@created="updateMilestone"
	)
</template>

<script>
import moment from 'moment';
import color_list from '@/data/color_list';

export default {
  name: 'Milestones',
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
    newMilestone_show: true,
  }),
  created() {},

  methods: {
    updateMilestone(value) {
      this.content.push(value);
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
