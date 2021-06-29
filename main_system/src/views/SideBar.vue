<template lang="pug">
v-navigation-drawer(
  app
  dark
  background-color=""
	color="#9ba2aa"
	:value="true"
	width="200"
	:class="{ 'padding-home': !user_route, 'padding-user': user_route }"
)
	v-list
		v-list-item(
			v-for="link in links"
			:key="link.to.name"
		  :to="is_login ? {name: link.to.name, params: {username: self.name}} : link.to"
		)
			v-row(no-gutters)
				v-col(cols="2")
					v-icon() {{ link.icon }}
				v-col(cols="10")
					span.ml-3() {{ link.text }}
		v-list-item(
			:to="{ name: 'Calendar' }"
			v-if="$store.state.is_login"
		)
			v-row(no-gutters)
				v-col(cols="2")
					v-icon() mdi-calendar-range
				v-col(cols="10")
					span.ml-3() calendar
			
		//- v-btn.mx-0(
		//-   v-for="link in links"
		//-   :key="link.to.name"
		//-   :to="is_login ? {name: link.to.name, params: {username: self.name}} : link.to"
		//- )
		//-   span() {{ link.text }}

		//-   v-icon() {{ link.icon }}
</template>

<script>
import { mapState } from 'vuex';
export default {
  name: 'SideBar',
  components: {},
  props: {
    // links: {
    //   required: true,
    //   type: Array
    // },
  },
  data: () => ({
    selected: 0,
  }),
  computed: {
    ...mapState({
      links: (state) => state.links,
      is_login: (state) => state.is_login,
      self: (state) => state.user.self,
    }),
    user_route() {
      return this.check_user();
    },
  },
  methods: {
    check_user() {
      switch (this.$route.name) {
        case 'UserArticles':
        case 'User':
        case 'HonorRoll':
        case 'Upl':
          return true;
        default:
          return false;
      }
    },
  },
};
</script>

<style>
.v-item-group.v-bottom-navigation .v-btn {
  min-width: 64px !important;
}
</style>

<style scoped>
.padding-user {
  padding-top: 230px;
  z-index: 0;
}
.padding-home {
  padding-top: 100px;
  z-index: 0;
}
</style>
