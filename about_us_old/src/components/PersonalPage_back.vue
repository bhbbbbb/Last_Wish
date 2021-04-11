<template lang="pug">
//- base-card.grey.lighten-5(@click="$emit('back')" height="100%" max-width="90vh" width="100%")
v-container.grey.lighten-5
  v-row.ma-0
    v-col(cols="6" md="4")
      v-card.pa-2(outlined="" tile="" height="50vh")
        h2 Photo
        base-card
          v-img(:src="photo")
    v-col(cols="12" sm="6" md="8")
      v-card.pa-2(shaped="" outlined="" tile="" height="50vh") Dream
  v-row.ma-0
    v-col(cols="6" md="4")
      v-row.ma-0.mb-3
        v-col.pa-0(cols="12")
          v-card.pa-2(outlined="" tile="") Name
      v-row.ma-0
        v-col.pa-0(cols="12")
          v-card.pa-2(outlined="" tile="") 職位
    v-col(cols="12" sm="6" md="8")
      v-card.pa-2(outlined="" tile="" height="10vh") skills
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
