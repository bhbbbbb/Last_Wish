<template lang="pug">
v-card.ma-1.pa-0(min-height="10vh" flat)
  v-row(no-gutters style="width: 100%;")
    v-sheet(color="#E1E3E5" width="100%")
      v-row(no-gutters style="color: #9BA2AA")
        v-col(cols="2")
          v-btn(text to="/") 取消
        v-col.d-flex.align-center.justify-center(cols="8")
          span.text-body-2() 新增計畫
        v-col.d-flex.justify-end(cols="2")
          v-btn(text @click="SubmitNewArticle") 發佈
  EditCard.mx-6.mt-3(:article.sync="new_article")

  MsgBox(:value.sync="show_info" :buttons="1" :timeout="1000") 
    v-row(no-gutters)
      v-col.d-flex.justify-center(cols="12")
        span {{ info_msg }}
</template>

<script>
export default {
  name: 'NewPost',
  components: {
    EditCard: () => import('@/components/EditCard'),
    MsgBox: () => import('@/components/MsgBox'),
  },
  data: () => ({
    new_article: {
      title: '',
      body: '',
      milestones: [],
      tags: [],
    },
    show_info: false,
    info_msg: '',
  }),
  computed: {},
  created() {},
  methods: {
    SubmitNewArticle() {
      if (!this.new_article.title) {
        this.Show_info('標題不得為空');
        return;
      }
      if (!this.new_article.body) {
        this.Show_info('內文不得為空');
        return;
      }
      this.$store.dispatch('addArticle', this.new_article).then((id) => {
        this.$router.push(`/article/${id}`);
      });
    },
    Show_info(info) {
      this.info_msg = info;
      this.show_info = true;
    },
  },
};
</script>
