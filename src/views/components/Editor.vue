<template>
  <div>
    <div ref="editor" class="text" >
      <h5>请输入</h5>
    </div>
  </div>
</template>

<script>
// import { mapGetters } from 'vuex'
import E from 'wangeditor'
// import { getToken } from '@/utils/auth'
export default {
  name: 'Editor',
  props: {
    menus: {
      type: Array,
      default: () => {
        return []
      }
    },
    value: {
      type: String,
      default: ''
    },
    isClear: {
      type: Boolean,
      default: false
    }
  },
  model: {
    prop: 'value',
    event: 'change'
  },
  data() {
    return {
      // headers: {
      //   'Authorization': 'Bearer ' + getToken()
      // },
      // editorContent: ''
      editor: null,
      info_: ''
    }
  },
  // computed: {
  //   ...mapGetters([
  //     'imagesUploadApi'
  //   ])
  // },
  mounted() {
    this.init()
    if (this.value) this.editor.txt.html(this.value) 
  },
  methods: {
    init() {
      this.editor = new E(this.$refs.editor)
      // editor.customConfig.uploadImgShowBase64 = true // 使用 base64 保存图片
      // // 不可修改
      // editor.customConfig.uploadImgHeaders = this.headers
      // // 自定义文件名，不可修改，修改后会上传失败
      // editor.customConfig.uploadFileName = 'file'
      // editor.customConfig.uploadImgServer = this.imagesUploadApi // 上传图片到服务器
      // editor.customConfig.onchange = (html) => {
      //   this.editorContent = html
      // }
      this.editor.customConfig.menus = [...[
        'head',  // 标题
        'bold',  // 粗体
        'fontSize',  // 字号
        'fontName',  // 字体
        'italic',  // 斜体
        'underline',  // 下划线
        'strikeThrough',  // 删除线
        'foreColor',  // 文字颜色
        'backColor',  // 背景颜色
        'link',  // 插入链接
        'justify',  // 对齐方式
        'quote',  // 引用
        'emoticon',  // 表情
        'code',  // 插入代码
        'undo',  // 撤销
        'redo'  // 重复
      ], ...this.menus]
      this.editor.customConfig.onchange = (html) => {
        this.info_ = html
        // html 即编辑器中的内容
        this.$emit('change', this.info_)
      }
      this.editor.create()
    },
    setVal(val) {
      this.editor.txt.html(val)
    }
  }
}
</script>

<style scoped>
  .editor-content{
    padding-left: 5px;
  }
  .text {
    text-align:left;
    margin: 5px
  }
</style>
