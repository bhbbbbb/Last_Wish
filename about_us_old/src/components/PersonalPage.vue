<template lang="pug">
base-card.transparent(@click.native="$emit('back')")
  v-container.ma-0.pa-0()
    v-row.ma-0(justify="center" align="end")
      v-img(:src="bg" width="1533" height="779" contain)
        v-row(align="center" style="height: 700px")
          v-col(cols="5")/
          v-col.pl-9.pt-12(cols="5" align-self="center")
              v-row.pl-2
                v-col.pa-0(cols="auto")
                  h2.f-35 {{ info.name_zh }}
                  h4.f-16 {{ info.name_en }}
                v-spacer
                v-col(align-self="center" cols="auto")
                  v-row(align="center" justify="end")
                    v-col.pa-0(cols="auto")
                      span.f-12 國立成功大學
                      br/
                      span.f-12 {{ info.department }}
                    
                    v-col.pa-2(cols="2")
                      v-img(:src="get_icon('side_bar')")
              
              v-row.pl-2.pt-5
                h3.f-18 {{ info.position }}
                
              v-row.pl-2.pt-5
                p.f-12 {{ info.body }}
                br/
              
              v-row
                v-col(cols="auto")
                  h3.f-16 Skills :
                v-col.ma-0.pa-1(v-for="icon in info.skill_icons" :key="icon" cols="auto")
                  v-img(:src="get_icon(icon)" height="40" width="40" contain)

              br/
              span.f-14(v-for="skill in info.skills" :key="skill") {{skill}}
                br/
              //- v-col(offset="5" cols="auto" align-self="center")


    
</template>

<script>
export default {
    name: "PersonalPage",
    props: ['my_id'],
    data: ()=>({
      info_us: require('@/data/about_me.json'),
    }),
    methods: {
      get_icon(icon_name) {
        // console.log("try get" + icon_name);
        return require('@/assets/about_us/icon/' + icon_name + '.png');
      }
    },
    computed: {
      info() {
        // console.log(this.info_us[this.my_id - 1]);
        return this.info_us[this.my_id - 1];
      },
      bg() {
        return require(`@/assets/about_us/bg${this.my_id}.png`);
      }
    }
}
</script>

<style scoped lang="sass">
.f-14
  font-size: 14pt

.f-18
  font-size: 18pt

.f-12
  font-size: 12pt

.f-16
  font-size: 16pt

.f-35
  font-size: 35pt

h2, h3, p, span, h4
  color: #7d7d7d

h2
  letter-spacing: 10pt

h3, h4
  letter-spacing: 4pt

h4
  font-weight: normal

p
  line-height: 23pt


</style>
