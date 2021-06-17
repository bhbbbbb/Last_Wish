<template>
  <v-card flat class="d-flex align-center flex-column">
    <v-card-title> 沒開手機版就不讓你用 </v-card-title>
    <v-card-subtitle class="d-flex">
      Windows : F12 → Ctrl + Shift + m → 選擇 iPhone X
    </v-card-subtitle>
    <br />
    <v-card-subtitle class="d-flex">
      Mac (請使用 google chrome) : (Fn+) F12 → Ctrl + Shift + m → 選擇 iPhone X
    </v-card-subtitle>
    <v-card-subtitle class="d-flex">
      或是用手機點選加入桌面書籤!!! ← 大推
    </v-card-subtitle>
    <br />
    <v-card-actions>
      <!-- <v-btn @click="Idontwant">我不依</v-btn> -->
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  name: 'MobileRequest',
  components: {},
  created() {
    if (this.$cookies.isKey('mobile')) this.Idontwant();
  },
  methods: {
    Idontwant() {
      this.$vuetify.breakpoint.mobileBreakpoint = 4000;
      this.$vuetify.breakpoint.mobile = true;
    },
  },
};
</script>
