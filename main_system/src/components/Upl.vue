<template>
  <div id="app">
    <a class="btn" @click="toggleShow">set avatar</a>
    <my-upload
      v-model="show"
      field="avatar"
      :width="300"
      :height="300"
      url="/uploads/uploadFile"
      :params="params"
      :headers="headers"
      img-format="png"
      @crop-success="cropSuccess"
      @crop-upload-success="cropUploadSuccess"
      @crop-upload-fail="cropUploadFail"
    ></my-upload>
    <img :src="imgDataUrl" />
  </div>
</template>

<script>
//import 'babel-polyfill'; // es6 shim
import myUpload from 'vue-image-crop-upload';

export default {
  name: 'Upl',
  components: {
    'my-upload': myUpload,
  },
  data: () => ({
    show: true,
    params: {
      token: '123456798',
      name: 'avatar',
    },
    headers: {
      smail: '*_~',
    },
    imgDataUrl: '', // the datebase64 url of created image
  }),
  methods: {
    toggleShow() {
      this.show = !this.show;
    },
    /**
     * crop success
     *
     * [param] imgDataUrl
     * [param] field
     */
    cropSuccess(imgDataUrl, field) {
      console.log('-------- crop success --------', field);
      this.imgDataUrl = imgDataUrl;
    },
    /**
     * upload success
     *
     * [param] jsonData   服务器返回数据，已进行json转码
     * [param] field
     */
    cropUploadSuccess(jsonData, field) {
      console.log('-------- upload success --------');
      console.log(jsonData);
      console.log('field: ' + field);
    },
    /**
     * upload fail
     *
     * [param] status    server api return error status, like 500
     * [param] field
     */
    cropUploadFail(status, field) {
      console.log('-------- upload fail --------');
      console.log(status);
      console.log('field: ' + field);
    },
  },
};
</script>
