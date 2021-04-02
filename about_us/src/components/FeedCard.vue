<template lang="pug">
v-col.ma-0(cols="12" md="3")

  base-card(
    height="250"
    :width="value.blank ? 50 : 250"
    v-show="!value.blank"
    @mouseover="display=false"
    @mouseleave="FlyIn()")
    v-img(:src="require(`@/assets/${value.img_front}`)" v-show="display" height="100%")
    v-img(:src="require(`@/assets/${value.img_back}`)" v-show="!display" height="100%")
</template>

<script>
export default {
    name: "FeedCard",
    data: () => ({
        flip: false,
        display: true,
    }),
    components: {
        FlipCard: () => import("@/components/base/FlipCard"),
    },
    props: {

        value: {
            type: Object,
            default: () => ({}),
        },
        // imgSrc: {
        //     type: String,
        // },
    },
    methods: {
        FlyIn() {
          this.display = true;
          
        }
    }
};
</script>

<style>
.v-image__image {
    transition: 0.3s linear;
}
</style>
