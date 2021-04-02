<template lang="pug">
v-card(flat="" tile="" color="rgba(0, 0, 0, 0)" width="200" v-bind="$attrs" v-on="$listeners")
  v-img(:src="memo_front")
    v-img(:src="require(`@/assets/demo.png`)", height="100%" content-class="fuck")
      slot
</template>

<script>
  export default {
    name: 'Memo',

    data: ()=>({
      memo_front: require("@/assets/sticky_note_flip.png"),
    }),

    methods: {
      Test() {
        // alert("fuck");
      }
    }
  }
</script>
<style scoped>
.v-image__image {
    transition: 0.3s linear;
}
.window {
  
}
</style>
