<template>
  <div class="home-page container-md">
    <section class="py-5 text-center container">
      <div class="row py-lg-5">
        <div class="col-lg-6 col-md-8 mx-auto">
          <img src="../assets/callout.svg" alt="callout" class="w-50"/>
          <h2 class="font-weight-light">随心写作，自由表达</h2>
          <p>
            <router-link to="/create" class="btn btn-primary my-2">开始写文章</router-link>
          </p>
        </div>
      </div>
    </section>
    <h4 class="font-weight-bold text-center">发现精彩</h4>
    <column-list :list="list"></column-list>
    <button
      v-if="!isLastPage"
      @click="loadMorePage"
      class="btn btn-outline-primary mt-2 mb-5 mx-auto btn-block w-25 load-more"
    >加载更多</button>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import { GlobalDataProps } from '../store/types'
import useLoadMore from '../hooks/useLoadMore'
import ColumnList from '../components/ColumnList.vue'

export default defineComponent({
  name: 'Home',
  components: {
    ColumnList
  },
  setup () {
    const store = useStore<GlobalDataProps>()
    const total = computed(() => store.state.columns.total)
    const currentPage = computed(() => store.state.columns.currentPage)
    onMounted(() => {
      store.dispatch('fetchColumns', { pageSize: 3 })
    })
    const list = computed(() => store.getters.getColumns)
    const { loadMorePage, isLastPage } = useLoadMore(
      'fetchColumns',
      total,
      {
        pageSize: 3,
        currentPage: currentPage.value ? currentPage.value + 1 : 2
      }
    )

    return {
      list,
      loadMorePage,
      isLastPage
    }
  }
})
</script>

<style scoped>
.load-more {
  margin-left: 50% !important;
  transform: translate3d(-50%, 0, 0);
}
</style>
