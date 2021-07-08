<template lang="pug">
p(v-if="markdown")
  VueMarkdown(v-if="parsed" @rendered="markdown_rendered = true")
    | {{ input }}
p(v-else-if="parsed")
  template(v-for="(item, idx) in data")
    NavLink.font-weight-bold(v-if="item.link" :to="`/${item.name}`") {{ item.text }}
    VueMarkdown(v-else-if="markdown") {{ item.text }}
    span(v-else) {{ item.text }}
p(v-else)
  span {{ content }}
</template>

<script>
import Vue from 'vue';
import router from '@/router';
import NavLink from '@/components/NavLink';
const NavLinkClass = Vue.extend(NavLink);
export default {
  name: 'Body',
  components: {
    NavLink: () => import('@/components/NavLink'),
    VueMarkdown: () => import('vue-markdown'),
  },
  props: {
    content: {
      type: String,
      required: true,
    },
    markdown: {
      type: Boolean,
      default: false,
    },
  },
  data: () => ({
    input: undefined,
    data: [],
    parsed: false,
    link_to_mound: [],
    markdown_rendered: false,
  }),
  watch: {
    content() {
      this.init();
    },
  },
  created() {
    this.init();
  },
  updated() {
    if (this.markdown_rendered) {
      this.mountNavLink();
      this.markdown_rendered = false;
    }
  },
  methods: {
    init() {
      this.data = [];
      this.link_to_mound = [];
      this.parsed = false;
      this.markdown_rendered = false;
      this.input = this.content;
      this.parse();
      this.checkValid().then(() => {
        this.parsed = true;
      });
    },
    newNavLink(name, text) {
      let NavLinkInstance = new NavLinkClass({
        router,
        propsData: {
          to: {
            name: 'User',
            params: {
              username: name,
            },
          },
        },
      });
      NavLinkInstance.$slots.default = [text];
      NavLinkInstance.$mount();
      return NavLinkInstance;
    },
    parse() {
      const pattern = /(?:\s|^)@(\w+)/;
      const trim_ws = /@(\w+)/;
      while (this.input) {
        let found = this.input.match(pattern);
        if (!found) break;
        let plain_text = this.input.substring(0, found.index);
        this.input = this.input.substring(found.index + found[0].length);

        let tag = found[0].match(trim_ws); // found[0] : '\s@Dev'
        plain_text += tag.input.substring(0, tag.index);

        if (plain_text)
          this.data.push({
            link: false,
            text: plain_text,
            name: undefined,
          });

        this.data.push({
          link: true,
          text: tag[0], // '@Dev'
          name: tag[1], // 'Dev'
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

    // must be called after parsed
    rebuild() {
      this.input = '';
      let stamp = 0;
      this.data.forEach((item) => {
        if (item.link) {
          let id = `${item.name}-${stamp++}`;
          this.input += `<span class="font-weight-bold" id="${id}"></span>`;
          this.link_to_mound.push({
            id,
            name: item.name,
            text: item.text,
          });
        } else {
          this.input += item.text;
        }
      });
    },
    mountNavLink() {
      this.link_to_mound.forEach((link) => {
        let instance = this.newNavLink(link.name, link.text);
        document.getElementById(link.id).appendChild(instance.$el);
      });
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
      if (this.markdown) this.rebuild();
    },
  },
};
</script>

<style scoped></style>
