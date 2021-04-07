<template lang="pug">
v-container
    
    v-toolbar.pt4(flat style="height: 100px")
        v-row(align="center")
        
            v-col(cols="3")
                v-row(style="height=100%" align="center")
                    v-col(cols="auto")
                        v-img(:src="get_icon('side_bar')" width="10")
                    v-col(cols="10")
                        span.bar-left 遺願清單
                        br/
                        span.bar-left The bucket list

            v-spacer
            v-col(cols="auto")
                h1 About Us

            v-spacer
            v-col(cols="3" )
                v-row(justify="end" align="center")
                    v-col(cols="4" align="center")
                        p.pt-7  
                            span 國立成功大學
                            br/
                            span National
                            br/
                            span Cheng Kung
                            br/
                            span University
                            br/
                            span(style="color: rgba(0, 0, 0, 0)") f
                            v-divider
                

    v-row(justify="center")
        v-img(:src="board_bg" width="90vh")

            v-hover(v-for="idx in 7" :key="idx" v-slot="{hover}")
                v-img.abs(:class="`card-${idx}`" @click="Expand(idx)"
                    :src="board_card(idx)", max-height="1000" max-width="1000" contain
                    :style="hover ? 'zoom: 102%' : 'zoom:100%'")

            v-overlay.overflow-y-auto.overflow(
                ref="ovr",
                :value="overlay",
                opacity="0",
                absolute,
                :dark="false",
                v-scroll.self
            )
                personal-page(@back="overlay=!overlay", :my_id="expand_for",)/
</template>

<script>
import {
    mapState
} from "vuex";
export default {
    name: "board",
    components: {
        PersonalPage: () => import("@/components/PersonalPage.vue"),
        // Memo: () => import("@/components/base/Memo.vue"),
    },
    data: () => ({
        overlay: false,
        expand_for: 1,
        selected_img: require("@/assets/articles/moroccandays.jpg"),
        board_bg: require("@/assets/about_us/about_us_outer/about_us_outer_bg.jpg"),
        // is_created: false,
        overlay_height: 0,
    }),
    computed: {
        ...mapState(["memos"]),

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
    left: 300px
    top: 30px

.card-2
    left: 350px
    bottom: 200px

.card-3
    left: 670px
    top: 130px

.card-4
    right: 670px
    top: 100px

.card-5
    right: 590px
    bottom: 180px

.card-6
    right: 390px
    top: 30px

.card-7
    right: 250px
    bottom: 230px

</style>
