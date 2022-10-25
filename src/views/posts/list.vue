<template>
  <div class="m-4 border-r-2 bg-white p-2"> 文章列表</div>
  <n-data-table
    remote
    ref="table"
    :columns="columns"
    :data="data"
    :loading="loading"
    :pagination="pagination"
    :row-key="rowKey"
    @update:page="handlePageChange"
  />
</template>
<script setup lang="ts">
  import { ref, reactive, h, onBeforeMount } from 'vue'
  import { NDataTable, NButton, NTag } from 'naive-ui'
  import { postAllApi } from '@/api/post'
  const columns = [
    {
      type: 'selection'
    },
    {
      title: '标题',
      key: 'title'
    },
    {
      title: '状态',
      key: 'status'
    },
    {
      title: '标签',
      width: 90,
      key: 'tags',
      render(row) {
        const tags = row.tags.map((tagKey) => {
          return h(
            NTag,
            {
              style: {
                marginRight: '6px'
              },
              round: true,
              size: 'small',
              type: 'info',
              bordered: false
            },
            {
              default: () => tagKey
            }
          )
        })
        return tags
      }
    },
    {
      title: '访问',
      key: 'count'
    },
    {
      title: '创建时间',
      key: 'creatTime'
    },
    {
      title: '操作',
      key: 'auth',
      render(row) {
        return [
          h(
            NButton,
            {
              size: 'tiny',
              type: 'info'
            },
            {
              default: () => '编辑'
            }
          ),
          h(
            NButton,
            {
              size: 'tiny',
              text:true
            },
            {
              default: () => '删除'
            }
          )
        ]
      }
    }
  ]
  const data = ref([])
  const pagination = reactive({
    page: 2,
    pageCount: 10,
    pageSize: 10
  })
  const loading = ref(false)
  onBeforeMount(async () => {
    loading.value = true
    const res = await postAllApi()
    data.value = res.data.data
    pagination.pageCount = res.data.pageTotal
    pagination.pageSize = res.data.total
    loading.value = false
  })
  const rowKey = (e) => e.id

  const handlePageChange = (e) => {
    console.log(e)
  }
</script>

<style scoped></style>
