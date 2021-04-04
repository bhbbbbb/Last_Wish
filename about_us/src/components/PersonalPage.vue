<template>
<base-card @click="$emit('back')" height="682" width="1533" color="rgba(0, 0, 0, 0)">
  <!--
  <v-img :src="require(`@/assets/demo.png`)" height="100%">
  </v-img>
-->

  <v-container class="grey lighten-5">
    <v-row>
      <v-col
        cols="6"
        md="4"
      >
        <v-card
          class="pa-2"
          outlined
          tile
          height="50vh"
        >
          Photo
        </v-card>
      </v-col>


      
      <v-col
        cols="12"
        sm="6"
        md="8"
      >
           <v-card
          shaped
          class="pa-2"
          outlined
          tile
          height="50vh"
        >
          Dream
        </v-card>
      </v-col>

      
    </v-row>
<v-row>
  <v-col
        cols="6"
        md="4"
      >
        <v-card
          class="pa-2"
          outlined
          tile
        >
          Name
        </v-card>
      </v-col>
          <v-col
        cols="12"
        sm="6"
        md="8"
      >
        <v-card
          class="pa-2"
          outlined
          tile
        >
          skills
        </v-card>
     </v-col>

      <v-col
        cols="6"
        md="4"
      >
        <v-card
          class="pa-2"
          outlined
          tile
        >
          職位
        </v-card>
      </v-col>
    </v-row>  
    
    
        
  </v-container>







</base-card>





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

<style> </style>
