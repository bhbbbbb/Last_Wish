<template lang="pug">
base-card(height="810")
    v-img(:src="require(`@/assets/articles/blurcamera.jpg`)" height="100%")
        slot/
</template>


<script>
export default {
    name: "PersonalPage",
    props: [],
}
</script>