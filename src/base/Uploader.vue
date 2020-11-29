<template>
  <div class="file-upload">
    <button class="btn btn-primary" @click.prevent="triggerUpload">
      <span v-if="fileStatus === 'loading'">正在上传...</span>
      <span v-else-if="fileStatus === 'success'">上传成功</span>
      <span v-else>点击上传</span>
    </button>
    <input
      type="file"
      class="file-input d-none"
      ref="fileInput"
      @change="handleFileChange"
    >

  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import axios from '../libs/http'
type UploadStatus = 'ready' | 'loading' | 'success' | 'error'

export default defineComponent({
  name: 'Uploader',
  props: {
    action: {
      type: String,
      required: true
    }
  },
  setup (props) {
    const fileInput = ref<null | HTMLInputElement>(null)
    const fileStatus = ref<UploadStatus>('ready')

    const triggerUpload = () => {
      if (fileInput.value) {
        fileInput.value.click()
      }
    }
    const handleFileChange = (e: Event) => {
      const currentTarget = e.target as HTMLInputElement
      const files = currentTarget.files
      if (files) {
        fileStatus.value = 'loading'
        const uploadedFiles = Array.from(files)
        const uploadedFile = uploadedFiles[0]
        const formData = new FormData()
        formData.append('file', uploadedFile)
        axios.post(props.action, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }).then(resp => {
          console.log(resp.data)
          fileStatus.value = 'success'
        }).catch(() => {
          fileStatus.value = 'error'
        }).finally(() => {
          if (fileInput.value) {
            fileInput.value.value = ''
          }
        })
      }
    }
    return {
      fileInput,
      triggerUpload,
      fileStatus,
      handleFileChange
    }
  }
})
</script>

<style scoped>

</style>
