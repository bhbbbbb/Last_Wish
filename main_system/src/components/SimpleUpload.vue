<template>
  <form enctype="multipart/form-data" @submit.prevent="sendFile">
    <div class="field">
      <div class="file is-boxed is-primary">
        <label class="file-label">
          <input
            ref="file"
            type="file"
            class="file-input"
            @change="selectFile"
          />
          <span class="file-cta">
            <span class="file-icon">
              <i class="fas fa-upload" />
            </span>
            <span class="file-label"> Choose a file... </span>
          </span>

          <span v-if="file" class="file-name">{{ file.name }}</span>
        </label>
      </div>
    </div>

    <div class="field">
      <button class="button is-info">Send</button>
    </div>
  </form>
</template>

<style>
@import 'https://cdn.jsdelivr.net/npm/bulma@0.9.2/css/bulma-rtl.min.css';
</style>

<script>
import { apiUploadFiles } from '@/store/api';
export default {
  name: 'SimpleUpload',
  data() {
    return {
      file: '',
    };
  },

  methods: {
    selectFile() {
      this.file = this.$refs.file.files[0];
    },

    sendFile() {
      console.log(this.file);
      const formData = new FormData();
      formData.append('file', this.file);
      apiUploadFiles(formData).then((res) => {
        console.log(res.status);
      });
    },
  },
};
</script>
