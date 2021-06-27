<template lang="pug">
v-sheet.pa-0.ma-0
  v-text-field(v-model.lazy="intro")
</template>

<script>
export default {
  name: 'SelfIntro',
  components: {},
  props: {
    value: {
      type: String,
      required: false,
      default: undefined,
    },
  },
  data: () => ({
    // intro: 'hello world',
  }),
  computed: {
    intro: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit('input', val);
      },
    },
  },
  created() {},
  methods: {},
};
</script>
