<template lang="pug">
v-container
    base-card(height="810")
        personal-page
            v-row
                v-col(offset="1", cols="3")
                    memo
                        v-img(:src="memo_front")

                v-col(offset="4", cols="3")
                    memo
                        img(:src="memo_front" width="240")

            v-row
                v-col(offset="3", cols="3")
                    memo
                        v-img(:src="memo_front")

                v-col(offset="1", cols="3")
                    memo
                        v-img(:src="memo_front")

            v-row
                v-col(offset="1", cols="3")
                    memo
                        v-img(:src="memo_front")

                v-col(offset="2", cols="2")
                    memo
                        v-img(:src="memo_front")

                v-col(offset="2", cols="2")
                    memo
                        v-img(:src="memo_front")



            
</template>

<script>
    import {mapState} from 'vuex'
    export default {
        name: "board",
        components: {
            PersonalPage: () => import("@/components/PersonalPage.vue"),
            Memo: () => import("@/components/base/Memo.vue")
        },
        data: ()=>({
            memo_front: require("@/assets/sticky_note_flip.png"),
        }),
        computed: {
            ...mapState(['memos']),

        }
    }
</script>

<style lang="sass">
#frame
    position: relative

</style>