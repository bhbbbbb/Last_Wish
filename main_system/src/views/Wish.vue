<template>
  <v-card class="ma-3 pa-1" min-height="80vh" rounded="lg" :color="color">
    <h3>this is a wish page for {{ context }}</h3>
  </v-card>
</template>

<script>
export default {
  name: 'Wish',
  components: {},
  props: {
    context: {
      type: String,
      required: true,
    },
    color: {
      type: String,
      default: '#F5F4F0',
    },
  },
  data: () => ({}),
  computed: {},
  created() {},

  methods: {},
};
</script>

<style></style>
