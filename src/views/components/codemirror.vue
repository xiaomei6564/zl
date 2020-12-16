<template>
  <textarea ref="mycode" class="codesql" v-model="code" :style="styles"></textarea>
</template>

<script>
  import "codemirror/theme/ambiance.css";
  import "codemirror/lib/codemirror.css";
  import "codemirror/addon/hint/show-hint.css";

  let CodeMirror = require("codemirror/lib/codemirror");
  require("codemirror/addon/edit/matchbrackets");
  require("codemirror/addon/selection/active-line");
  require("codemirror/mode/sql/sql");
  require("codemirror/addon/hint/show-hint");
  require("codemirror/addon/hint/sql-hint");
  import sqlFormatter from "sql-formatter";
  export default {
    name: "codeMirror",
    props: {
      styles: {
        type: Object,
        default: () => {
          return {
            height: '500px',
            width: 'auto'
          }
        }
      }
    },
    data () {
      return {
        code: '',
        editor: null,
        readOnlyState: true
      }
    },
    watch: {
      readOnlyState() {
        document.querySelector('.CodeMirror').style.background = this.readOnlyState ? '#e4e7ed' : '#fff'
      }
    },
    mounted () {
      let mime = 'text/x-mariadb'
      // let theme = 'ambiance'//设置主题，不设置的会使用默认主题
      this.editor = CodeMirror.fromTextArea(this.$refs.mycode, {
        mode: mime,//选择对应代码编辑器的语言，我这边选的是数据库，根据个人情况自行设置即可
        indentWithTabs: true,
        smartIndent: true,
        lineNumbers: true,
        matchBrackets: true,
        readOnly: true,
        // theme: theme,
        // autofocus: true,
        extraKeys: {'Ctrl': 'autocomplete'},//自定义快捷键
        hintOptions: {//自定义提示选项
          tables: {
            users: ['name', 'score', 'birthDate'],
            countries: ['name', 'population', 'size']
          }
        }
      })
      //代码自动提示功能，记住使用cursorActivity事件不要使用change事件，这是一个坑，那样页面直接会卡死
      // this.editor.on('cursorActivity', () => {
      //   this.editor.showHint()
      // })
      this.editor.setSize(this.styles.width, this.styles.height);
    },
    methods: {
      format(){
        /*将sql内容进行格式后放入编辑器中*/
        this.editor.setValue(sqlFormatter.format(this.editor.getValue()));
      },
      setRead(state) {
        this.editor.setOption("readOnly", state);
        this.readOnlyState = state
      },
      setValue(val) {
        this.editor.setValue(val)
      },
      getValue() {
        return this.editor.getValue()
      }
    }
  }
</script>

<style lang='scss'>
   .CodeMirror {
    //  font-family: "Courier New",sans-serif!important;
    font-family: "Source Code Pro","DejaVu Sans Mono","Ubuntu Mono","Anonymous Pro","Droid Sans Mono",Menlo,Monaco,Consolas,Inconsolata,Courier,monospace,"PingFang SC","Microsoft YaHei",sans-serif;
    font-size: 11px !important;
    line-height: 1.5!important;
    background: #e4e7ed;
    // font-size: 12px;
    // letter-spacing: 1px;
    // font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB, Microsoft YaHei, Arial, sans-serif;
    /* font-size: 11pt; */
    /* font-family: Consolas, Menlo, Monaco, Lucida Console, Liberation Mono, DejaVu Sans Mono, Bitstream Vera Sans Mono, Courier New, monospace, serif; */
  }
</style>