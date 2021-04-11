<template>
  <v-app>
    

    <board />

    
  </v-app>
</template>

<script>
  export default {
    name: 'App',

    components: {
      
      board: () => import('@/components/board.vue'),
    },
  }
</script>
