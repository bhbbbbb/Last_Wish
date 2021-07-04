<template lang="pug">
v-dialog(
  max-width="400"
  v-model="inner_value"
  :width="width"
  v-bind="$attrs"
)
  template(#activator="{ on, attrs }")
    slot(name="activator" :on="on" :attrs="attrs")
  v-card.pt-3.px-5.pb-1(flat)
    slot
    
    v-card-actions.pa-0.mx-0.mb-0.mt-3.justify-space-around
      v-btn(
        v-if="buttons === 2"
        text
        plain
        @click="cancel"
      )
        slot(name="cancel") 取消
      v-btn(
        text
        plain
        @click="confirm"
      )
        slot(name="confirm") 確定
      

</template>

<script>
export default {
  name: 'MsgBox',
  props: {
    width: {
      type: [String, Number],
      required: false,
      default: 300,
    },
    buttons: {
      type: Number,
      default: 2,
      validator: (val) => val === 1 || val === 2,
    },
    value: {
      type: Boolean,
      default: undefined,
    },
    timeout: {
      type: [Number, Boolean],
      default: false,
    },
  },
  data: () => ({
    value_: undefined,
  }),
  computed: {
    inner_value: {
      get() {
        if (this.value === undefined) return this.value_;
        else return this.value;
      },
      set(val) {
        if (this.value === undefined) this.value_ = val;
        else this.$emit('update:value', val);
      },
    },
  },
  watch: {
    inner_value(val) {
      if (val && this.timeout) {
        setTimeout(() => {
          this.inner_value = false;
        }, this.timeout);
      }
    },
  },
  created() {},
  methods: {
    confirm() {
      this.$emit('confirm');
      this.inner_value = false;
    },
    cancel(){
      this.$emit('cancel');
      this.inner_value = false;
    },
  },
};
</script>

<style scoped></style>
