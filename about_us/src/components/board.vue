<template lang="pug">

v-container(style="max-width:100vw")
    v-toolbar.pt4(flat style="max-height:10vh")
        v-row(align="center" style="max-width:100vw")
        
            v-col(cols="3")
                v-row(style="height=100%" align="center" )
                    v-col(cols="auto")
                        v-img(:src="get_icon('side_bar')" max-width="0.5vw")
                    v-col(cols="10" maxheigh="10vh" )
                        span.bar-left 遺願清單
                        br/
                        span.bar-left The bucket list

            v-spacer
            v-col(cols="auto" maxheigh="10vh")
                h1 About Us
            v-spacer
            v-col(cols="3" )
                v-row(justify="end" align="center")
                    v-col(cols="4" align="center" max-height="10vh" min-width="10em")
                        p.pt-7  
                            span 國立成功大學
                            br/
                            span National
                            br/
                            span Cheng Kung
                            br/
                            span University
                            br/
                            span(style="color: rgba(0, 0, 0, 0)") 
                            v-divider
                

    v-row(justify="center" max-width="100vw" max-height="90vh")
        v-img(:src="board_bg" max-height="100vh" max-width="100vw")

            v-hover(v-for="idx in 7" :key="idx" v-slot="{hover}")
                v-img.abs(:class="`card-${idx}`" @click="Expand(idx)"
                    :src="board_card(idx)",min-width="10vw" max-width="12vw" contain
                    :style="hover ? 'zoom: 102%' : 'zoom:100%'")

            v-overlay.overflow-y-auto.overflow(
                ref="ovr",
                :value="overlay",
                opacity="0",
                absolute,
                :dark="false",
                v-scroll.self
            )
                personal-page(@back="overlay=!overlay", :my_id="expand_for",)
</template>

<script>

export default {
    name: "board",
    components: {
        PersonalPage: () => import("@/components/PersonalPage.vue"),
    },
    data: () => ({
        overlay: false,
        expand_for: 1,
        board_bg: require("@/assets/about_us/about_us_outer/about_us_outer_bg.jpg"),
        overlay_height: 0,
    }),
    computed: {
       

    },
    methods: {
        
        Expand(idx) {
            this.overlay = !this.overlay;
            this.expand_for = idx;
        },
        board_card(idx) {
            return require(`@/assets/about_us/about_us_outer/card${idx}.png`);
        },
        get_icon(icon_name) {
        return require('@/assets/about_us/icon/' + icon_name + '.png');
      }
    },
    mounted() {
        // console.log(this.$refs.ovr.clientHeight)
    }
};
</script>

<style lang="sass" scoped>
#board_frame 
    margin: 54px 0px 0px 120px

p
    color: #7d7d7d
    font-weight: normal
    font-size: 10pt
    line-height: 10pt
    text-align: right

.bar-left
    color: #7d7d7d
    font-weight: normal
    font-size: 12pt

h1
    color: #7d7d7d
    font-weight: lighter
    letter-spacing: 5pt
    font-size: 40pt

.rel
    position: relative

.abs
    position: absolute

.card-1
    left: 20vw
    top: 10vh

.card-2
    left: 20vw
    bottom: 20vh

.card-3
    left: 35vw
    top: 18vh

.card-4
    right: 40vw
    top: 16vh

.card-5
    right: 29vw
    bottom: 18vh

.card-6
    right: 18vw
    top: 5vh

.card-7
    right: 13vw
    bottom: 15vh

</style>
