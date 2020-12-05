<template>
  <div v-if="currentPost" class="post-detail-page w-690">
    <nav aria-label="breadcrumb">
      <ol class="breadcrumb">
        <li class="breadcrumb-item"><a href="/">首页</a></li>
        <li class="breadcrumb-item"><a :href="`/column/${currentPost.column}`">专栏首页</a></li>
        <li class="breadcrumb-item active" aria-current="page">{{ currentPost.title }}</li>
      </ol>
    </nav>
    <article class="mb-5 pb-3">
      <img :src="currentImageUrl" alt="currentPost.title" class="rounded-lg img-fluid my-4" v-if="currentImageUrl">
      <h2 class="mb-4">{{ currentPost.title }}</h2>
      <div class="user-profile-component border-top border-bottom py-3 mb-5 align-items-center row g-0">
        <div class="col">
          <user-profile :user="currentPost.author" v-if="typeof currentPost.author === 'object'"></user-profile>
        </div>
        <span class="text-muted col text-right font-italic">发表于：{{ currentPost.createdAt }}</span>
      </div>
      <div v-html="currentHTML"></div>
      <div v-if="showEditArea" class="btn-group mt-5">
        <router-link
          type="button"
          class="btn btn-success"
          :to="{ name: 'create', query: { id: currentPost._id }}"
        >编辑</router-link>
        <button type="button" class="btn btn-danger" @click.prevent="modalIsVisible = true">删除</button>
      </div>
    </article>
    <modal
      v-if="modalIsVisible"
      title="删除文章"
      :visible="modalIsVisible"
      @modal-on-close="modalIsVisible = false"
      @modal-on-confirm="hideAndDelete"
    >
      <p>确定要删除这篇文章吗？</p>
    </modal>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import MarkdownIt from 'markdown-it'
import { GlobalDataProps, PostProps, ImageProps, UserProps, ResponseType } from '../store/types'
import UserProfile from '../components/UserProfile.vue'
import Modal from '../base/Modal.vue'
import createMessage from '../base/createMessage'

export default defineComponent({
  name: 'PostDetail',
  components: {
    UserProfile,
    Modal
  },
  setup () {
    const store = useStore<GlobalDataProps>()
    const router = useRouter()
    const route = useRoute()
    const currentId = route.params.id
    const md = new MarkdownIt()
    const modalIsVisible = ref(false)

    onMounted(() => {
      store.dispatch('fetchPost', currentId)
    })
    const currentPost = computed<PostProps>(() => store.getters.getCurrentPost(currentId))
    const currentHTML = computed(() => {
      const { content, isHTML } = currentPost.value
      if (currentPost.value && content) {
        return isHTML ? content : md.render(content)
      }
    })

    // 判断文章的用户是否跟登陆用户一致
    const showEditArea = computed(() => {
      const { isLogin, _id } = store.state.user
      if (currentPost.value && currentPost.value.author && isLogin) {
        const postAuthor = currentPost.value.author as UserProps
        return postAuthor._id === _id
      } else {
        return false
      }
    })

    const currentImageUrl = computed(() => {
      if (currentPost.value && currentPost.value.image) {
        const { image } = currentPost.value
        return (image as ImageProps).url + '?x-oss-process=image/resize,w_850'
      } else {
        return null
      }
    })

    const hideAndDelete = () => {
      modalIsVisible.value = false
      store.dispatch('deletePost', currentId).then((rawData: ResponseType<PostProps>) => {
        createMessage('删除成功，2秒后跳转到专栏首页', 'success', 2000)
        setTimeout(() => {
          router.push(`/column/${store.state.user.column}`)
        }, 2000)
      })
    }

    return {
      currentPost,
      currentHTML,
      currentImageUrl,
      showEditArea,
      modalIsVisible,
      hideAndDelete
    }
  }
})
</script>

<style scoped>
.w-690 {
  width: 690px;
  margin: 0 auto;
}
.rounded-lg {
  border-radius: .3rem!important;
}
.font-italic {
  font-style: italic!important;
}
</style>
