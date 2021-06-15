<template>
  <v-card
    class="ma-3 pa-1"
    min-height="80vh"
    rounded="lg"
    :color="color_list($route.params.id)"
  >
    <h3>this is a wish page for {{ context }}</h3>
  </v-card>
</template>

<script>
import color_list from '@/data/color_list';
export default {
  name: 'Wish',
  components: {},
  props: {
    context: {
      type: String,
      required: true,
    },
  },
  data: () => ({}),
  computed: {},
  created() {},

  methods: {
    color_list,
  },
};
</script>

<style></style>
