<template>
  <div class="home-page">
    <column-list :list="list"></column-list>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from 'vue'
import ColumnList from '../components/ColumnList.vue'
import { testColumns, ColumnProps } from '../testData'

export default defineComponent({
  name: 'Home',
  components: {
    ColumnList
  },
  setup () {
    return {
      list: testColumns
    }
  }
})
</script>

<style scoped>

</style>
