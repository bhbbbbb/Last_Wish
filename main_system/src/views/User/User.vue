<template lang="pug">
v-main.grey.lighten-3
  v-container
    v-row.justify-center
      //- v-col(cols="12" sm="2")
      //-   v-sheet(rounded="lg" min-height="268")
          // 
      v-col(cols="12" sm="8")
        router-view/
            
      //- v-col(cols="12" sm="2")
      //-   v-sheet(rounded="lg" min-height="268")
            
</template>

<script>

export default {
  name: "User",
  components: {
  }
}
</script>

