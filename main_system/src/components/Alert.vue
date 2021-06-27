<template lang="pug">
v-alert(
	border="left"
	color="#F3E7E7"
	dismissible
	:value="value"
	:width="width"
) info1
</template>

<script>
export default {
  name: 'Alert',
  props: {
    width: {
      type: [String, Number],
      required: false,
      default: '80%',
    },
    timeout: {
      type: [Number, Boolean],
      default: false,
    },
    value: {
      type: Boolean,
      default: false,
    },
  },
  data: () => ({
    // _value: undefined,
  }),
  watch: {
    value(val) {
      // this._value = val;
      if (val && this.timeout) {
        setTimeout(() => {
          this.$emit('update:value', false);
        }, this.timeout);
      }
    },
  },
  created() {
    // this._value = this.value;
    // this._value= true;
  },
  methods: {},
};
</script>

<style scoped></style>
