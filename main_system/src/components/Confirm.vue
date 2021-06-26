<template lang="pug">
v-dialog(
	max-width="400"
	v-model="value"
	:width="width"
)
	template(#activator="{ on, attrs }")
		slot(name="activator" :on="on" :attrs="attrs")
	v-card(flat)
		v-card-title
			slot
		
		v-card-actions.justify-space-around
			v-btn(
				text
				@click="value = false"
			)
				slot(name="cancel") 取消
			v-btn(
				text
				@click="$emit('confirm')"
			)
				slot(name="confirm") 確定
			

</template>

<script>
export default {
  name: 'Confirm',
  props: {
    width: {
      type: [String, Number],
      required: false,
      default: 300,
    },
  },
  data: () => ({
    value: false,
  }),
  created() {},
  methods: {},
};
</script>

<style scoped></style>
