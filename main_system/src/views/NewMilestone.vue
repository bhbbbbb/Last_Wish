<template>
  <v-card
    class="ma-0 pa-1"
    min-height="80vh"
    rounded="lg"
    :color="color_list($route.params.id)"
    width="100%"
  >
    <v-timeline align-top dense>
      <v-timeline-item
        v-for="(wish, idx) in wishes"
        :key="idx"
        small
        :color="color_list(7)"
      >
        <v-avatar slot="icon" />
        <v-row no-gutters>
          <v-col class="d-flex flex-grow-1">
            <span class="d-flex text-no-wrap" style="overflow-x: hidden">
              {{ wish.title ? wish.title : wish }}
            </span>
          </v-col>
          <v-col cols="auto" class="d-flex justify-end pr-4">
            <span class="subtitle-2 text--disabled">
              {{ wish.time ? date_format(wish.time) : '' }}
            </span>
          </v-col>
        </v-row>
      </v-timeline-item>

      <v-timeline-item
        class="align-center"
        small
        :color="color_list(7)"
        style="padding-top: 12px"
      >
        <v-icon slot="icon" small color="white"> mdi-plus </v-icon>
        <v-text-field v-model.lazy="newMilestone.title" class="pr-5">
        </v-text-field>
      </v-timeline-item>
    </v-timeline>
    <v-card-actions class="justify-center">
      <v-row>
        <v-col cols="12" class="d-flex justify-center">
          <v-date-picker
            v-model="newMilestone.time"
            :color="color_list(7)"
            :max="max"
          >
          </v-date-picker>
        </v-col>
        <v-col cols="12" class="d-flex justify-center">
          <v-btn @click="submitMilestone"> submit </v-btn>
        </v-col>
      </v-row>
    </v-card-actions>
  </v-card>
</template>

<script>
import { apiUploadMilestone } from '@/store/api';
import color_list from '@/store/color_list.js';
export default {
  name: 'NewMilestone',
  components: {},
  props: {
    id: {
      type: Number,
      required: true,
    },
    wishes: {
      type: Array,
      required: true,
    },
  },
  data: () => ({
    newMilestone: {
      title: undefined,
      time: undefined,
      body: undefined,
    },
    max: undefined,
  }),
  computed: {},
  created() {
    let now = new Date(Date.now());
    this.max = now.toISOString().substring(0, 10);
  },

  methods: {
    date_format(time) {
      let time_arr = time.split('-');
      return time_arr[1] + '/' + time_arr[2];
    },
    color_list,
    submitMilestone() {
      // TODO : tell user error message
      if (!this.newMilestone.time) return;
      if (!this.newMilestone.title.trim()) return;

      apiUploadMilestone({
        article_id: String(this.id),
        newMilestone: this.newMilestone,
      }).then(({ data }) => {
        this.wishes.push(data);
        this.newMilestone = '';
      });
    },
  },
};
</script>

<style scpoed>
.v-timeline-item {
  padding-bottom: 12px !important;
}
</style>
