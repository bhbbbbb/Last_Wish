<template lang="pug">
p(v-if="parsed")
  template(v-for="(item, idx) in data")
    NavLink.font-weight-bold(v-if="item.link" :to="`/${item.name}`") {{ item.text }}
    span(v-else) {{ item.text }}
p(v-else)
  span {{ content }}
</template>

<script>
export default {
  name: 'Body',
  components: {
    NavLink: () => import('@/components/NavLink'),
  },
  props: {
    content: {
      type: String,
      required: true,
    },
  },
  data: () => ({
    input: undefined,
    data: [],
    parsed: false,
  }),
  watch: {
    content() {
      this.init();
    },
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      this.data = [];
      this.parsed = false;
      this.input = this.content;
      this.parse();
      this.checkValid().then(() => {
        this.parsed = true;
      });
    },
    parse() {
      const pattern = /(?:\s|^)@(\w+)/;
      while (this.input) {
        let found = this.input.match(pattern);
        if (!found) break;
        let plain_text = this.input.substring(0, found.index);
        this.input = this.input.substring(found.index + found[0].length);

        if (plain_text)
          this.data.push({
            link: false,
            text: plain_text,
            name: undefined,
          });

        this.data.push({
          link: true,
          text: found[0], // '@Dev'
          name: found[1], // 'Dev'
        });
      }
      if (this.input) {
        this.data.push({
          link: false,
          text: this.input,
          name: undefined,
        });
      }
    },
    async checkValid() {
      let promises = [];
      this.data.forEach((item) => {
        if (!item.link) return;
        let pro = this.$store
          .dispatch('user/nameExisted', item.name)
          .then((res) => {
            item.link = res;
          });
        promises.push(pro);
      });
      await Promise.all(promises);
    },
  },
};
</script>

<style scoped></style>
