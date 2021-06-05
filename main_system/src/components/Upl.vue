<template>
<div>
  <cropper
	class="cropper"
	:src="img"
  :debounce="false"
	:stencil-props="{
		aspectRatio: 1,
    handlers: {},
		movable: false,
		scalable: false,
	}"
  :stencil-size="{
		width: 280,
		height: 280
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
</div>
</template>

<script>
import { Cropper, Preview} from 'vue-advanced-cropper';
import 'vue-advanced-cropper/dist/style.css';
//import 'vue-advanced-cropper/dist/themes/theme.compact.css';
export default {
  name: 'Upl',
	components: {
		Cropper,
    preview:Preview
	},
	data() {
		return {
			img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/Golden_star.svg/1200px-Golden_star.svg.png',
			result: {
				coordinates: null,
				image: null
			}
		};
	},
	methods: {
		change({ coordinates, canvas }) {
			console.log(coordinates, canvas)
		},
    onChange({ coordinates, image }) {
			this.result = {
				coordinates,
				image
			};
		},
	},
}
</script>

<style>
.cropper {
	height: 600px;
	background: #DDD;
}
.Preview{
  border-radius: 50%;
}
</style>