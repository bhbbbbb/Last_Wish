<template>
  <div class="PIC">
    <cropper
      ref="cropper"
      class="cropper"
      stencil-component="circle-stencil"
      :src="image.src"
      :debounce="false"
      :stencil-props="{
        aspectRatio: 1,
        handlers: {},
        movable: false,
        scalable: false,
      }"
      :stencil-size="{
        width: 280,
        height: 280,
      }"
      image-restriction="stencil"
      @change="onChange"
    />
    <div class="Preview">
      <preview
        class="Preview"
        :width="120"
        :height="120"
        :image="result.image"
        :coordinates="result.coordinates"
      />
    </div>

    <form enctype="multipart/form-data" @submit.prevent="sendFile">
      <div class="field">
        <div class="file is-boxed is-primary">
          <label class="file-label">
            <input
              ref="file"
              type="file"
              class="file-input"
              accept="image/*"
              @change="loadImage($event)"
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
  </div>
</template>

<script>
import { Cropper, Preview } from 'vue-advanced-cropper';
import { saveAs } from 'file-saver';
import { apiUploadFiles } from '@/store/api';
import 'vue-advanced-cropper/dist/style.css';
//import 'vue-advanced-cropper/dist/themes/theme.compact.css';
function getMimeType(file, fallback = null) {
  const byteArray = new Uint8Array(file).subarray(0, 4);
  let header = '';
  for (let i = 0; i < byteArray.length; i++) {
    header += byteArray[i].toString(16);
  }
  switch (header) {
    case '89504e47':
      return 'image/png';
    case '47494638':
      return 'image/gif';
    case 'ffd8ffe0':
    case 'ffd8ffe1':
    case 'ffd8ffe2':
    case 'ffd8ffe3':
    case 'ffd8ffe8':
      return 'image/jpeg';
    default:
      return fallback;
  }
}
export default {
  name: 'Upl',
  components: {
    cropper: Cropper,
    preview: Preview,
  },
  data() {
    return {
      file: '',
      image: {
        src: null,
        type: null,
      },
      result: {
        coordinates: null,
        image: null,
      },
    };
  },
  destroyed() {
    // Revoke the object URL, to allow the garbage collector to destroy the uploaded before file
    if (this.image.src) {
      URL.revokeObjectURL(this.image.src);
    }
  },
  methods: {
    change({ coordinates, canvas }) {
      console.log(coordinates, canvas);
    },
    onChange({ coordinates, image }) {
      this.result = {
        coordinates,
        image,
      };
    },
    crop() {
      const { canvas } = this.$refs.cropper.getResult();
      canvas.toBlob((blob) => {
        // Do something with blob: upload to a server, download and etc.
        saveAs(blob);
        //console.log(blob);
      }, this.image.type);
    },
    reset() {
      this.image = {
        src: null,
        type: null,
      };
    },
    loadImage(event) {
      // Reference to the DOM input element
      this.file = this.$refs.file.files[0];
      const { files } = event.target;
      // Ensure that you have a file before attempting to read it
      if (files && files[0]) {
        // 1. Revoke the object URL, to allow the garbage collector to destroy the uploaded before file
        if (this.image.src) {
          URL.revokeObjectURL(this.image.src);
        }
        // 2. Create the blob link to the file to optimize performance:
        const blob = URL.createObjectURL(files[0]);

        // 3. The steps below are designated to determine a file mime type to use it during the
        // getting of a cropped image from the canvas. You can replace it them by the following string,
        // but the type will be derived from the extension and it can lead to an incorrect result:
        //
        // this.image = {
        //    src: blob;
        //    type: files[0].type
        // }

        // Create a new FileReader to read this image binary data
        const reader = new FileReader();
        // Define a callback function to run, when FileReader finishes its job
        reader.onload = (e) => {
          // Note: arrow function used here, so that "this.image" refers to the image of Vue component
          this.image = {
            // Set the image source (it will look like blob:http://example.com/2c5270a5-18b5-406e-a4fb-07427f5e7b94)
            src: blob,
            // Determine the image type to preserve it during the extracting the image from canvas:
            type: getMimeType(e.target.result, files[0].type),
          };
        };
        // Start the reader job - read file as a data url (base64 format)
        reader.readAsArrayBuffer(files[0]);
      }
    },
    sendFile() {
      const { canvas } = this.$refs.cropper.getResult();
      if (canvas) {
        const form = new FormData();
        canvas.toBlob((blob) => {
          form.append('file', blob);
          // You can use axios, superagent and other libraries instead here
          apiUploadFiles(form).then((res) => {
            console.log(res.status);
            console.log(res.data)
            this.$emit('get_img',res.data);
            if (res.status == 200) {
              this.file = '';
              this.reset();
            }
          });
          // Perhaps you should add the setting appropriate file format here
        }, 'image/jpeg');
      }
    },
  },
};
</script>

<style>
@import 'https://cdn.jsdelivr.net/npm/bulma@0.9.2/css/bulma-rtl.min.css';
.cropper {
  height: 600px;
  background: #ddd;
}
.Preview {
  border-radius: 50%;
}

.PIC {
  width: 100vw;
}
</style>
