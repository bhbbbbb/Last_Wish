<template>
  <v-col
    cols="12"
    :md="
      size === 2
        ? 6
        : size === 3
        ? 4
        : size === 4
        ? 3
        : size === 6
        ? 2
        : undefined
    "
    class="pa-1"
  >
    <flip-card class="" height="100%" :flipped="flip">
      <template slot="front">
        <base-card
          :height="value.prominent ? 450 : 250"
          color="grey lighten-1"
          dark
          @click="flip = !flip"
        >
          <v-img
            :src="imgSrc"
            height="100%"
            gradient="rgba(0, 0, 0, .42), rgba(0, 0, 0, .42)"
          >
            <!-- <v-row v-if="!value.prominent" class="fill-height text-right ma-0">
              <v-col cols="12">
                <v-chip
                  label
                  class="mx-0 mb-2 text-uppercase"
                  color="grey darken-3"
                  text-color="white"
                  small
                  @click.stop=""
                >
                  {{ value.category }}
                </v-chip>

                <h3 class="title font-weight-bold mb-2">
                  {{ value.title }}
                </h3>

                <div class="caption">{{ value.author }}<br />Date</div>
              </v-col>

              <v-col align-self="end">
                <v-chip
                  class="text-uppercase ma-0"
                  color="primary"
                  label
                  small
                  @click.stop=""
                >
                  Read More
                </v-chip>
              </v-col>
            </v-row> -->
          </v-img>
        </base-card>
      </template>
      <template slot="back">
        <base-card
          :height="value.prominent ? 450 : 250"
          color="grey lighten-1"
          dark
          @click="flip = !flip"
        >
          <v-img
            :src="require(`@/assets/articles/blurcamera.jpg`)"
            height="100%"
            gradient="rgba(0, 0, 0, .42), rgba(0, 0, 0, .42)"
          >
          </v-img>
        </base-card>
      </template>
    </flip-card>
  </v-col>
</template>

<script>
export default {
  name: "FeedCard",
  data: () => ({
    flip: false
  }),
  components: {
    FlipCard: () => import("@/components/base/FlipCard"),
  },
  props: {
    size: {
      type: Number,
      required: true,
    },
    value: {
      type: Object,
      default: () => ({}),
    },
    imgSrc: {
      type: String,
    },
  },
  methods: {
    Test() {
      alert("fuck");
    }
  }
};
</script>

<style>
.v-image__image {
  transition: 0.3s linear;
}
</style>
