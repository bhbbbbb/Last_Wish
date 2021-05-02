<template lang="pug">
component(v-if='$vuetify.breakpoint.mobile' :is="componentId") 

</template>

<script>
export default {
    name: 'FooterWrap',
    components: {
        FooterM : () => import('@/components/Footer/FooterM')
    },
    data: () => ({
        componentId: 'FooterM'
    })
}
</script>
