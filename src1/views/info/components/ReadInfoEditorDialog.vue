<template>
  <el-dialog
    title="投放文本内容"
    :visible.sync="readInfoEditorVisible"
    :width="dialogWidth"
    center
    append-to-body
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :class="[{'ydp-editor-wrap': messageData.ledType === 1}, {'qcp-editor-wrap': messageData.ledType === 2}]"
    @open="showDialog"
    @close="handleClose"
  >
    <div class="content ql-editor" v-html="messageData.messageContent" />
  </el-dialog>
</template>

<script>
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

export default {
  name: 'ReadInfoEditorDialog',
  props: {
    messageData: {
      type: Object,
      required: true
    },
    visible: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      readInfoEditorVisible: false
    }
  },
  computed: {
    dialogWidth() {
      return this.messageData.ledType === 1 ? '520px' : '960px'
    }
  },
  watch: {
    visible(val) {
      this.readInfoEditorVisible = val
    }
  },
  methods: {
    showDialog() {
    },
    handleClose() {
      this.readInfoEditorVisible = false
      this.$emit('update:visible', this.readInfoEditorVisible)
    }
  }
}
</script>

<style scoped lang="scss">
.ydp-editor-wrap{
  >>>.el-dialog{
    width: 240px!important;
    height: 534px!important;
    overflow: hidden;
    .el-dialog__body{
      padding: 0!important;
      .ql-editor{
        font-size: 13px;
      }
    }
  }
}
.qcp-editor-wrap{
  >>>.el-dialog{
    width: 384px!important;
    height: 310px!important;
    overflow: hidden;
    .el-dialog__body{
      padding: 0!important;
      .ql-editor{
        font-size: 13px;
      }
    }
  }
}
</style>
