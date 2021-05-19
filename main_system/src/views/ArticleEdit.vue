<template lang="pug">
v-card.ma-0.pa-1(min-height="80vh", rounded="lg", :color="color_list(id)")
  v-container            
    v-row(no-gutters="no-gutters")
      v-col.d-flex.flex-column.flex-shrink-1.align-center.ma-0(cols="4")
        v-avatar.grey.lighten-1(size="64")
        span.py-3.text-center {{ author.username }}
      v-col.d-flex.justify-center.align-center(cols="8")
        v-text-field(
          background-color="transparent"
          solo
          v-model.lazy="context.title"
        )
    v-row(no-gutters="no-gutters")
      v-col.my-0(cols="12")
        v-divider
      v-col.py-2.my-0(cols="auto")
        v-card-subtitle.ma-0.px-4.py-0 {{ context.date }}
    v-row
      v-col.px-8
        v-textarea(
          auto-grow
          solo
          v-model.lazy="context.body"
          background-color="transparent"
        )
  v-card-actions.justify-center
    v-btn(@click="Submit") Submit



  

</template>

<script>
import color_list from '@/store/color_list.js';
export default {
  name: 'Article',
  components: {},
  props: {
    id: {
      type: Number,
      required: true,
    },
    context: {
      type: Object,
      required: true,
    },
    author: {
      type: Object,
      required: true,
    },
  },
  data: () => ({}),
  computed: {},
  created() {},

  methods: {
    color_list,
    Submit() {
      console.log(this.context);
    },
  },
};
</script>

<style>
.pre {
  white-space: pre-wrap;
}
</style>
