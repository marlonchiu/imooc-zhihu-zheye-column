<template>
  <div class="column-detail-page w-690">
    <div class="column-info row mb-4 border-bottom pb-4 align-items-center" v-if="column">
      <div class="col-3 text-center">
        <img :src="column.avatar && column.avatar.fitUrl" :alt="column.title" class="rounded-circle border w-100">
      </div>
      <div class="col-9">
        <h4>{{column.title}}</h4>
        <p class="text-muted">{{column.description}}</p>
      </div>
    </div>
    <post-list :list="postList"></post-list>
    <button
      v-if="!isLastPage"
      @click="loadMorePage"
      class="btn btn-outline-primary mt-2 mb-5 mx-auto btn-block w-25 load-more"
    >加载更多</button>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, onMounted, watch, reactive } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'
import { GlobalDataProps, ColumnProps } from '../store/types'
import PostList from '../components/PostList.vue'
import { addColumnAvatar } from '../libs/helper'
import useLoadMore from '../hooks/useLoadMore'

type ColumnIdProps = string | undefined;

export default defineComponent({
  name: 'ColumnDetail',
  components: {
    PostList
  },
  setup () {
    const store = useStore<GlobalDataProps>()
    const route = useRoute()
    const currentId = route.params.id as ColumnIdProps

    const loaded = reactive({
      currentPage: 0,
      total: 0
    })
    const total = computed(() => loaded.total)
    watch(store.state.posts.loadedColumns, () => {
      console.log(store.state.posts.loadedColumns)
      const { currentPage, total } = store.getters.getLoadedPost(currentId)
      loaded.currentPage = currentPage
      loaded.total = total
    })

    onMounted(() => {
      store.dispatch('fetchColumn', currentId)
      store.dispatch('fetchPosts', { columnId: currentId, pageSize: 3 })
    })

    const column = computed(() => {
      const selectColumn = store.getters.getColumnById(currentId) as ColumnProps | undefined
      if (selectColumn) {
        addColumnAvatar(selectColumn, 100, 100)
      }
      return selectColumn
    })

    const params = {
      columnId: currentId,
      pageSize: 3,
      currentPage: loaded.currentPage ? loaded.currentPage + 1 : 2
    }
    const { loadMorePage, isLastPage } = useLoadMore(
      'fetchPosts',
      total,
      params
    )
    const postList = computed(() => store.getters.getPostsByCid(currentId))

    return {
      column,
      postList,
      loadMorePage,
      isLastPage
    }
  }
})
</script>

<style scoped>
.w-690 {
  width: 690px;
  margin: 0 auto;
}
.load-more {
  margin-left: 50% !important;
  transform: translate3d(-50%, 0, 0);
}
</style>
