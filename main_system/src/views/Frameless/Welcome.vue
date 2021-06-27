<template lang="pug">
	v-carousel(
		:show-arrows="false"
		height="100vh"
		light
		hide-delimiter-background
	)
		v-carousel-item(color="white")
			div.fill-screen.d-flex.justify-center.align-center
				MyLogin
		v-carousel-item
			div.fill-screen.d-flex.justify-center.align-center
				Page2
</template>

<script>
export default {
  name: 'Welcome',
  components: {
    MyLogin: () => import('@/views/Frameless/MyLogin'),
    Page2: () => import('@/views/Frameless/Page2'),
  },
  data: () => ({}),
  methods: {},
};
</script>
