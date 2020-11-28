<template>
  <div class="column-detail-page w-75 mx-auto">
    <div class="column-info row mb-4 border-bottom pb-4 align-items-center" v-if="column">
      <div class="col-3 text-center">
        <img :src="column.avatar && column.avatar.url" :alt="column.title" class="rounded-circle border w-100">
      </div>
      <div class="col-9">
        <h4>{{column.title}}</h4>
        <p class="text-muted">{{column.description}}</p>
      </div>
    </div>
    <post-list :list="postList"></post-list>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'
import { GlobalDataProps } from '../store'
import { ColumnProps } from '../testData'
import PostList from '../components/PostList.vue'

export default defineComponent({
  name: 'ColumnDetail',
  components: {
    PostList
  },
  setup () {
    const route = useRoute()
    const store = useStore<GlobalDataProps>()

    const currentId = route.params.id
    onMounted(() => {
      store.dispatch('fetchColumn', currentId)
      store.dispatch('fetchPosts', currentId)
    })
    const column = computed(() => {
      const selectColumn = store.getters.getColumnById(currentId) as ColumnProps
      if (selectColumn) {
        if (!selectColumn.avatar) {
          selectColumn.avatar = {
            url: require('@/assets/column.jpg')
          }
        } else {
          // selectColumn.avatar.url = selectColumn.avatar.url + '?x-oss-process=image/resize,m_pad,h_100,w_100'
        }
      }
      return selectColumn
    })
    const postList = computed(() => store.getters.getPostsByCid(currentId))

    return {
      column,
      postList
    }
  }
})
</script>

<style scoped>

</style>
