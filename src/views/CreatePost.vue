<template>
  <div class="create-post-page container">
    <h4>{{ isEditMode ? "编辑文章" : "新建文章" }}</h4>
    <uploader
      action="/api/upload"
      class="d-flex align-items-center justify-content-center bg-light text-secondary w-100 my-4"
      :beforeUpload="uploadCheck"
      :uploaded="uploadedData"
      @file-uploaded-success="onFileUploadedSuccess"
    >
      <h2>点击上传头图</h2>
      <template #loading>
        <div class="d-flex">
          <div class="spinner-border text-secondary" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
          <h2>正在上传</h2>
        </div>
      </template>
      <template #uploaded="dataProps">
        <div class="uploaded-area">
          <img :src="dataProps.uploadedData.data.url" />
          <h3>点击重新上传</h3>
        </div>
      </template>
    </uploader>
    <validate-form @form-submit="onFormSubmit">
      <div class="mb-3">
        <label class="form-label">文章标题：</label>
        <validate-input
          :rules="titleRules"
          v-model="titleVal"
          placeholder="请输入文章标题"
          type="text"
        />
      </div>
      <div class="mb-3">
        <label class="form-label">文章详情：</label>
        <validate-input
          rows="10"
          tag="textarea"
          placeholder="请输入文章详情"
          :rules="contentRules"
          v-model="contentVal"
        />
      </div>
      <template #submit>
        <button class="btn btn-primary btn-large">{{ isEditMode ? '更新文章' : '发表文章' }}</button>
      </template>
    </validate-form>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useStore } from 'vuex'
import { GlobalDataProps, PostProps, ResponseType, ImageProps } from '../store/types'
import ValidateInput, { RulesProps } from '../base/ValidateInput.vue'
import ValidateForm from '../base/ValidateForm.vue'
import Uploader from '../base/Uploader.vue'
import createMessage from '../base/createMessage'
import { beforeUploadCheck } from '../libs/helper'

export default defineComponent({
  name: 'CreatePost',
  components: {
    ValidateInput,
    ValidateForm,
    Uploader
  },
  setup () {
    const store = useStore<GlobalDataProps>()
    const router = useRouter()
    const route = useRoute()
    const queryId = route.query.id
    const isEditMode = !!queryId // 两个!!转换为 boolean

    const uploadedData = ref()
    const titleVal = ref('')
    let imageId = ''
    const titleRules: RulesProps = [
      { type: 'required', message: '文章标题不能为空' }
    ]
    const contentVal = ref('')
    const contentRules: RulesProps = [
      { type: 'required', message: '文章详情不能为空' }
    ]

    onMounted(() => {
      if (isEditMode) {
        store.dispatch('fetchPost', queryId).then((rawData: ResponseType<PostProps>) => {
          const currentPost = rawData.data
          console.log(currentPost)
          const { image, title, content } = currentPost
          titleVal.value = title
          contentVal.value = content || ''
          if (image) {
            uploadedData.value = { data: image }
          }
        })
      }
    })

    const onFileUploadedSuccess = (rawData: ResponseType<ImageProps>) => {
      if (rawData.data._id) {
        imageId = rawData.data._id
      }
    }

    const onFormSubmit = (result: boolean) => {
      if (result) {
        const { column, _id } = store.state.user
        if (column) {
          const newPost: PostProps = {
            title: titleVal.value,
            content: contentVal.value,
            column,
            author: _id
          }
          if (imageId) {
            newPost.image = imageId
          }

          const actionName = isEditMode ? 'updatePost' : 'createPost'
          const sendData = isEditMode ? {
            id: queryId,
            payload: newPost
          } : newPost

          // 提交文章
          store.dispatch(actionName, sendData).then(() => {
            createMessage('发表成功，2秒后跳转到文章', 'success', 2000)
            setTimeout(() => {
              router.push({ name: 'column', params: { id: column } })
            }, 2000)
          })
        }
      }
    }

    const uploadCheck = (file: File) => {
      const result = beforeUploadCheck(file, { format: ['image/jpeg', 'image/png'], size: 1 })
      const { passed, error } = result
      if (error === 'format') {
        createMessage('上传图片只能是 JPG/PNG 格式!', 'error')
      }
      if (error === 'size') {
        createMessage('上传图片大小不能超过 1Mb!', 'error')
      }
      return passed
    }

    return {
      titleVal,
      titleRules,
      contentVal,
      contentRules,
      onFormSubmit,
      uploadCheck,
      onFileUploadedSuccess,
      isEditMode,
      uploadedData
    }
  }
})
</script>

<style>
.create-post-page .file-upload-container {
  height: 200px;
  cursor: pointer;
  overflow: hidden;
}
.create-post-page .file-upload-container img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.uploaded-area {
  position: relative;
}
.uploaded-area:hover h3 {
  display: block;
}
.uploaded-area h3 {
  display: none;
  position: absolute;
  color: #999;
  text-align: center;
  width: 100%;
  top: 50%;
}
</style>
