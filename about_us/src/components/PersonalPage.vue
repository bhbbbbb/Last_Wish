<template lang="pug">
base-card(@click="$emit('back')", height="682" width="1533" color="rgba(0, 0, 0, 0)")
    v-img(:src="require(`@/assets/demo.png`)" height="100%")
        slot/
</template>


<script>
export default {
    name: "PersonalPage",
    props: [],
    methods: {
        Test() {
            $emit("back")
        }
    }
}
</script>