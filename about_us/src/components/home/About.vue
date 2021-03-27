<template lang="pug">
  v-container#about(tag='section')
    base-subheading About Us
    p {{ about_us_content }}
    
    
    
</template>

<script>
  export default {
    name: 'HomeAbout',

    data() {
      return {
        about_us_content: "some fucking content",
      }
    },
  }
</script>
