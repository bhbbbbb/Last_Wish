<template lang="pug">
v-menu.mx-2(
	bottom
	offset-y
	min-width="336"
)
	template(#activator="{ on, attrs }")
		v-btn.ma-0.pa-1(
			v-if="$store.state.is_login"
			width="64"
			height="64"
			text
			v-on="on"
			v-bind="attrs"
		)
			v-badge.d-flex.flex-column.align-center(
				overlap
				color="#D6C5BE"
				offset-x="16"
				offset-y="18"
				:value="$store.state.notify.unread"
			)
				v-icon(large color="white") mdi-bell-outline
				span.caption(style="color: white;") 通知
				template(#badge)
					span {{ $store.state.notify.unread }}

	//- menu #list
	v-card.pt-3(
		min-width="336"
		width="100%"
		max-width="500"
		max-height="600"
		style="z-index: 9999999"
	)
		v-row(no-gutters)
			v-col.pl-5.d-flex.justify-start.align-center(cols="6")
				span.title 新通知

			v-col.d-flex.justify-end.align-center(cols="6")
				v-btn(
					plain
					text
					@click="allCheck"
				)
					span 將全部已讀
		
		v-list.py-0(
			flat
		)
			template(
				v-for="(not, idx) in $store.state.notify.data"
			)
				v-list-item.px-3.mx-0.my-0(
					:key="idx"
					two-line
					:to="{ name: 'Article', params: { id: not.link }}"
					active-class="unread"
					:class="{ unread: !not.checked }"
					@click="check(idx)"
				)
					v-sheet.ma-0.pa-0(
						min-width="312"
						color="transparent"
					)
						v-row.flex-nowrap.align-center(no-gutters)
							v-col.d-flex.flex-shrink-1.align-center(cols="2")
								UserAvatar(:user="not.from")
							v-col.d-flex.align-center(cols="10")
								v-container.ma-0.pa-0
									v-row.flex-wrap.flex-nowrap(no-gutters)
										NavLink.mx-1.font-weight-bold(:to="{ name: 'User', params: { username: not.from.name }}")
										| {{ not.from.name }}
										span.ml-1.text-nowrap.ellipsis {{ not.description }}
									v-row(no-gutters)
										v-col.d-flex.justify-end(cols="12")
											span.caption {{ moment(not.date).fromNow() }}
				v-divider(v-if="idx !== $store.state.notify.data.length - 1")



</template>

<script>
import moment from 'moment';
export default {
  name: 'Notification',
  components: {
    UserAvatar: () => import('@/components/UserAvatar'),
    NavLink: () => import('@/components/NavLink'),
  },
  props: {},
  data: () => ({}),
  computed: {},
  created() {},
  methods: {
    check(idx) {
      this.$store.dispatch('notify/check', idx);
    },
    allCheck() {
      if (this.$store.state.notify.data)
        for (let i = 0; i < this.$store.state.notify.data.length; i++)
          this.check(i);
    },
    moment,
  },
};
</script>
<style scoped>
.v-btn__content {
  display: flex;
  flex-direction: column;
}
.unread {
  background-color: rgba(155, 162, 170, 0.15);
  /* box-shadow: inset; */
}
</style>
