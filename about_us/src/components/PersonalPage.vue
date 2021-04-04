<template>
<base-card class="grey lighten-5" @click="$emit('back')" height="687" width="1533">
  <v-container class="grey lighten-5">
    <v-row class="ma-0">
      <v-col cols="6" md="4">
        <v-card class="pa-2" outlined="" tile="" height="50vh">
          <h2>Photo</h2>
          <base-card>
            <v-img :src="photo"></v-img>
          </base-card>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6" md="8">
        <v-card class="pa-2" shaped="" outlined="" tile="" height="50vh">Dream</v-card>
      </v-col>
    </v-row>
    <v-row class="ma-0">
      <v-col cols="6" md="4">
        <v-row class="ma-0 mb-3">
          <v-col class="pa-0" cols="12">
            <v-card class="pa-2" outlined="" tile="">Name</v-card>
          </v-col>
        </v-row>
        <v-row class="ma-0">
          <v-col class="pa-0" cols="12">
            <v-card class="pa-2" outlined="" tile="">職位</v-card>
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="12" sm="6" md="8">
        <v-card class="pa-2" outlined="" tile="" height="10vh">skills</v-card>
      </v-col>
    </v-row>
  </v-container>
</base-card>
</template>

<script>
export default {
    name: "PersonalPage",
    props: ['name', 'skill', 'position', 'photo'],
    methods: {
        Test() {
            $emit("back")
        }
    }
}
</script>

<style> </style>
