<template lang="pug">
v-main.grey.lighten-3
  v-container()
    v-row
      v-col(cols="12" sm="2")
        v-sheet(rounded="lg" min-height="268")
          // 
      v-col(cols="12" sm="8")
        router-view/

      v-col(cols="12" sm="2")
        my-login


</template>

<script>
export default {
    name: "Home",
    components: {
        MyLogin: () => import('@/components/MyLogin'),
        NewPost: () => import('@/components/NewPost'),
        // CoreAppBar: () => import('@/components/core/app_bar.vue'),
    }
}
</script>
