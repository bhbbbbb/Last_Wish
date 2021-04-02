<template lang="pug">
v-container
    base-card(height="800")
        v-img(:src="board_bg", height="100%")
            base-card#board_frame(height="682" width="1533" color="rgba(0, 0, 0, 0)")
                v-container
                    v-row
                        v-col(offset="2", cols="3")
                            memo(@click="Expand(0)")

                        v-col(offset="4", cols="3")
                            memo(@click="Expand(1)")

                    v-row
                        v-col(offset="3", cols="3")
                            memo(@click="Expand(2)")

                        v-col(offset="2", cols="3")
                            memo(@click="Expand(3)")

                    v-row
                        v-col(offset="1", cols="3")
                            memo(@click="Expand(4)")

                        v-col(offset="1", cols="2")
                            memo(@click="Expand(5)")

                        v-col(offset="3", cols="2")
                            memo(@click="Expand(6)")

                    v-overlay(
                        :value="overlay",
                        opacity="0",
                        absolute,
                        :dark="false",
                    )
                        personal-page(@back="overlay=!overlay")/
</template>

<script>
import {
    mapState
} from "vuex";
export default {
    name: "board",
    components: {
        PersonalPage: () => import("@/components/PersonalPage.vue"),
        Memo: () => import("@/components/base/Memo.vue"),
    },
    data: () => ({
        overlay: false,
        selected_img: require("@/assets/articles/moroccandays.jpg"),
        board_bg: require("@/assets/Black_Board_h800.png"),
    }),
    computed: {
        ...mapState(["memos"]),
    },
    methods: {
        Expand(idx) {
            this.overlay = !this.overlay
        }
    }
};
</script>

<style lang="sass" scoped>
#board_frame 
    margin: 54px 0px 0px 120px
</style>
