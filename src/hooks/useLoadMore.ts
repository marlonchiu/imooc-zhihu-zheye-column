import { ref, computed, ComputedRef } from 'vue'
import { useStore } from 'vuex'

export interface LoadParams {
  columnId?: string;
  currentPage: number;
  pageSize: number;
}
const useLoadMore = (actionName: string, total: ComputedRef<number>, params: LoadParams = { currentPage: 1, pageSize: 5 }) => {
  const store = useStore()
  const { currentPage: current, pageSize, columnId } = params
  const currentPage = ref(current)
  const requestParams = computed(() => ({
    currentPage: currentPage.value,
    pageSize: pageSize,
    columnId: columnId
  }))
  const loadMorePage = () => {
    store.dispatch(actionName, requestParams.value).then(() => {
      currentPage.value++
    })
  }

  const isLastPage = computed(() => {
    return Math.ceil(total.value / pageSize) < currentPage.value
  })
  return {
    loadMorePage,
    isLastPage,
    currentPage
  }
}

export default useLoadMore
