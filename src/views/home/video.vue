<template>
  <el-dialog :append-to-body="true" :close-on-click-modal="false" :visible.sync="dialog" width="700px">
    <video id="myVideo" style="width: 100%;height: 400px"
      class="video-js vjs-default-skin vjs-big-play-centered"
      controls 
      ref="myVideo"
      autoplay="muted"
      preload="auto">
        <source :src="pathUrl" type="video/mp4" > 
      </video>   
  </el-dialog>
</template>
<script>
import Video from 'video.js'
import 'video.js/dist/video-js.css'
export default {
  data() {
    return {
      dialog: false,
    }
  },
  watch: {
    dialog() {
      if (!this.dialog) {
        this.$refs.myVideo.pause()
      }
    }
  },
  computed: {
    pathUrl() {
      return 'http://10.19.5.20:8080/file/video/video-20200530112916990.mp4'
      if (window.location.host == 'me.cofcotrading.com') {
        return 'http://me.cofcotrading.com/hana8000/file/video/video-20200530040216975.mp4'
      } else {
        return 'http://10.19.5.20:8080/file/video/video-20200530112916990.mp4'
      }
    }
  }

}
</script>