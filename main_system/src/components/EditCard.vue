<template lang="pug">
v-card.ma-0.pa-0.transparent(min-height="10vh" flat)

  //- #title
  v-row(no-gutters)
    v-text-field.ma-0.pa-0(
      placeholder="標題"
      v-model="article.title"
      autocomplete="off"
    )

  //- #body
  v-row(no-gutters)
    v-textarea.ma-0.pa-0(
      no-resize
      placeholder="輸入內文"
      v-model="article.body"
      :rows="getNumberOfLines(article.body)"
    )

  //- #tags
  v-row(no-gutters)
    v-text-field(
      style="font-weight: bold;"
      id="tag-input"
      solo
      flat
      autocomplete="off"
      placeholder="#newtag"
      prepend-icon="mdi-plus-circle-outline"
      append-outer-icon="mdi-check"
      v-model="tag_model"
      @focus="addHashTag"
      @blur="removeHashTag"
      @click:prepend="focus()"
      @click:append-outer="addTag()"
      @keydown.enter="addTag()"
      :error-messages="err_msg"
      :rules="[valid, repeated]"
    )
  v-row(no-gutters)
    v-chip.ma-1(
      v-for="(tag, idx) in article.tags"
      :key="idx"
      close
      close-icon="mdi-close"
      close-label="刪除"
      color="#9BA2AA"
      small
      dark
      @click:close="removeTag(idx)"
    ) {{ tag }} &nbsp;
  
  //-- #ms
  MilestonesEdit(
    :content="article.milestones"
    :author-id="$store.state.user.self.id"
    @deleted="del_ms"
  )
</template>

<script>
export default {
  name: 'EditCard',
  components: {
    MilestonesEdit: () => import('@/components/MilestonesEdit'),
  },
  props: {
    article: {
      type: Object,
      required: true,
    },
  },
  data: () => ({
    tag_model: '',
    err_msg: undefined,
  }),
  watch: {
    tag_model(new_val, val) {
      this.err_msg = undefined;
      if (new_val.length <= val.length || new_val.length <= 2) return;
      if (new_val && new_val.charAt(new_val.length - 1) === ' ') {
        this.tag_model = this.tag_model.substring(0, new_val.length - 1);
        this.addTag();
      }
    },
  },
  created() {},
  methods: {
    // https://github.com/vuetifyjs/vuetify/issues/5314#issuecomment-602072847
    getNumberOfLines(text) {
      /** replacement for the 'auto-grow' property of v-textarea
       *  as this feature has issue with maintaining the scroll
       *  position of the textarea.
       *  Source: https://github.com/vuetifyjs/vuetify/issues/5314
       */
      if (text && typeof text === typeof 'string') {
        return text.replace(/\r\n/g, '\n').split('\n').length; // replace makes sure, that this works with line breaks of different OS
      } else return 1;
    },
    addHashTag() {
      if (!this.tag_model) this.tag_model = '#';
    },
    removeHashTag() {
      if (this.tag_model === '#') this.tag_model = '';
    },
    focus() {
      document.getElementById('tag-input').focus();
    },
    addTag() {
      if (this.tag_model) this.tag_model.trim();
      let valid = this.valid(this.tag_model);
      if (valid !== true) {
        this.err_msg = valid;
        return;
      }
      valid = this.repeated(this.tag_model);
      if (valid !== true) {
        this.err_msg = valid;
        return;
      } else if (this.tag_model.length < 2) {
        this.err_msg = 'cannot be empty';
        return;
      }
      this.article.tags.push(this.tag_model);
      this.tag_model = '#';
    },
    removeTag(idx) {
      this.article.tags.splice(idx, 1);
    },
    valid(val) {
      const pattern = /^#\S+$/g;
      if (val.length <= 1) return true;
      return pattern.test(val) || 'contain illegal charactersss';
    },
    repeated(val) {
      return !this.article.tags.includes(val) || `${val} already exists`;
    },
    del_ms(_id) {
      this.$emit('deleted', _id);
    },
  },
};
</script>

<style>
.theme--light.v-text-field--solo > .v-input__control > .v-input__slot {
  background: transparent !important;
}
</style>
