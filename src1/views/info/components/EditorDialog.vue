<template>
  <el-dialog
    title="投放内容"
    :visible.sync="editorVisible"
    :width="dialogWidth"
    center
    append-to-body
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :class="[{'ydp-editor-wrap': eData.ledType === 1}, {'qcp-editor-wrap': eData.ledType === 2}]"
    @open="showDialog"
    @close="handleClose"
  >
    <quill-editor ref="text" v-model="messageContent" class="myQuillEditor" :options="editorOption" />
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" round @click="handleSave()">保存</el-button>
      <el-button round @click="handleClose">取 消</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { quillEditor } from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import { deepClone } from '../../../utils/common'

const titleConfig = {
  'ql-bold': '加粗',
  'ql-color': '颜色',
  'ql-font': '字体',
  'ql-code': '插入代码',
  'ql-italic': '斜体',
  'ql-link': '添加链接',
  'ql-background': '背景颜色',
  'ql-size': '字体大小',
  'ql-strike': '删除线',
  'ql-script': '上标/下标',
  'ql-underline': '下划线',
  'ql-blockquote': '引用',
  'ql-header': '标题',
  'ql-indent': '缩进',
  'ql-list': '列表',
  'ql-align': '文本对齐',
  'ql-direction': '文本方向',
  'ql-code-block': '代码块',
  'ql-formula': '公式',
  'ql-image': '图片',
  'ql-video': '视频',
  'ql-clean': '清除字体样式',
  'ql-upload': '文件'
}

export default {
  name: 'EditorDialog',
  components: {
    quillEditor
  },
  props: {
    visible: {
      type: Boolean,
      required: true
    },
    editorData: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      editorVisible: false,
      eData: {},
      messageContent: '',
      editorOption: {
        // theme: 'snow', // 默认是这个，这个代码不注释会显示富文本所有的功能
        placeholder: '最多输入500字。',
        modules: {
          toolbar: {
            container: [
              ['bold', 'italic', 'underline', 'strike'], // toggled buttons
              ['blockquote', 'code-block'],

              [{ 'header': 1 }, { 'header': 2 }], // custom button values
              [{ 'list': 'ordered' }, { 'list': 'bullet' }],
              [{ 'script': 'sub' }, { 'script': 'super' }], // superscript/subscript
              [{ 'indent': '-1' }, { 'indent': '+1' }], // outdent/indent
              [{ 'direction': 'rtl' }], // text direction

              [{ 'size': ['small', false, 'large', 'huge'] }], // custom dropdown
              [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

              [{ 'color': [] }, { 'background': [] }], // dropdown with defaults from theme
              [{ 'font': [] }],
              [{ 'align': [] }],
              // ['link', 'image', 'video'],
              ['clean'] // remove formatting button
            ],
            handlers: {
              'image': function(value) {
                if (value) {
                  document.querySelector('.avatar-uploader input').click()
                } else {
                  this.quill.format('image', false)
                }
              }
            }
          }
        }
      }
    }
  },
  computed: {
    dialogWidth() {
      return this.eData.ledType === 1 ? '520px' : '520px'
    }
  },
  watch: {
    visible(val) {
      this.editorVisible = val
    }
  },
  mounted() {
  },
  methods: {
    showDialog() {
      this.eData = deepClone(this.editorData)
      this.messageContent = this.editorData.messageContent
      this.$nextTick(() => {
        this.addQuillTitle()
      })
    },
    handleClose() {
      this.editorVisible = false
      this.$emit('update:visible', this.editorVisible)
    },
    handleSave() {
      this.editorVisible = false
      this.$emit('changeMessageContent', {
        messageContent: this.messageContent,
        fileOrder: this.eData.fileOrder
      })
    },
    addQuillTitle() {
      const oToolBar = document.querySelector('.ql-toolbar')
      const aButton = oToolBar.querySelectorAll('button')
      const aSelect = oToolBar.querySelectorAll('select')
      aButton.forEach(function(item) {
        if (item.className === 'ql-script') {
          item.value === 'sub' ? (item.title = '下标') : (item.title = '上标')
        } else if (item.className === 'ql-indent') {
          item.value === '+1'
            ? (item.title = '向右缩进')
            : (item.title = '向左缩进')
        } else {
          item.title = titleConfig[item.classList[0]]
        }
      })
      aSelect.forEach(function(item) {
        item.parentNode.title = titleConfig[item.classList[0]]
      })
    }
  }
}
</script>

<style scoped lang="scss">

.ydp-editor-wrap{
  >>>.el-dialog{
    height: 780px;
    .ql-toolbar{
      margin-bottom: 40px;
    }
    .ql-container{
      width: 240px;
      height: 480px;
      margin: 0 auto;
      border-top: 1px solid #ccc;
    }
  }
}
.qcp-editor-wrap{
  >>>.el-dialog{
    height: 620px;
    .ql-toolbar{
      margin-bottom: 40px;
    }
    .ql-container{
      width: 384px;
      height: 256px;
      margin: 0 auto;
      border-top: 1px solid #ccc;
    }
  }
}
</style>
