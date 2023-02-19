<template>
  <div class="my-2 bg-white p-2">
    <n-input-group>
      <n-input
        v-model:value="keyword"
        :style="{ width: '80%' }"
        placeholder="请输入搜索标题"
        @keyup.enter="getPostAll(1)"
      />
      <n-button type="primary" @click="getPostAll(1)"> 搜索 </n-button>
    </n-input-group>
  </div>
  <div class="bg-white pb-2">
    <n-data-table
      max-height="66vh"
      ref="table"
      remote
      :columns="columns"
      :data="data"
      :loading="loading"
      :pagination="pagination"
      :row-key="rowKey"
      @update:page="handlePageChange"
      @update:filters="changeFiters"
    />
  </div>
</template>
<script setup lang="ts">
  import { h, onBeforeMount, reactive, ref } from 'vue'
  import {
    DataTableColumn,
    NButton,
    NDataTable,
    NTag,
    NPopconfirm,
    NInput,
    NInputGroup,
    DataTableFilterState,
    DataTableBaseColumn
  } from 'naive-ui'
  import { deletePostApi, postAllApi } from '@/api/post'
  import { RouterLink } from 'vue-router'
  import dayjs from 'dayjs'
  import { postAllModel } from '@/api/model/postModel'
  import { PostStatusName } from '@/common/post-status'
  import { getTagAllApi } from '@/api/tag'

  const keyword = ref('')
  let filterValues: DataTableFilterState = {
    status: null,
    tag: null
  }

  const columns: Array<DataTableColumn> = reactive([
    {
      type: 'selection'
    },
    {
      title: '标题',
      align: 'center',
      key: 'title'
    },
    {
      title: '状态',
      align: 'center',
      key: 'status',
      filter: true,
      filterMode: 'and',
      filterMultiple: false,
      filterOptions: [
        {
          label: '发布',
          value: 'PUBLISH'
        },
        {
          label: '草稿',
          value: 'DRAFT'
        }
      ]
    },
    {
      title: '标签',
      width: 140,
      align: 'center',
      key: 'tags',
      filter: true,
      filterMode: 'and',
      filterMultiple: false,
      render(row) {
        return (row.tags as string[]).map((tagKey) => {
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
      }
    },
    {
      title: '访问',
      align: 'center',
      key: 'count'
    },
    {
      title: '创建时间',
      align: 'center',
      key: 'creatTime'
    },
    {
      title: '操作',
      align: 'center',
      key: 'auth',
      render(row) {
        return [
          h(
            RouterLink,
            {
              to: './write?id=' + row.id
            },
            () =>
              h(
                NButton,
                {
                  size: 'tiny',
                  type: 'info'
                },
                {
                  default: () => '编辑'
                }
              )
          ),
          h(
            NPopconfirm,
            {
              onPositiveClick() {
                del(row.id as string)
              }
            },
            {
              default: () => '确定删除吗？',
              trigger: () =>
                h(
                  NButton,
                  {
                    size: 'tiny',
                    type: 'error',
                    style: {
                      marginLeft: '2px'
                    }
                  },
                  {
                    default: () => '删除'
                  }
                )
            }
          )
        ]
      }
    }
  ])
  const data = ref<any[]>([])
  const pagination: { pageCount: number; pageSize: number } = reactive({
    pageCount: 10,
    pageSize: 10
  })
  const loading = ref(false)
  onBeforeMount(async () => {
    let res = await Promise.all([getPostAll(1), await getTagAllApi()])
    columns[3].filterOptions = res[1].data.map((item) => {
      return {
        label: item.name,
        value: item.id
      }
    })
  })

  //表格头部筛选结果
  const changeFiters = (filters: DataTableFilterState) => {
    filterValues = filters
    getPostAll(1)
  }
  const rowKey = (e: { id: string }): number | string => e.id

  const handlePageChange = async (e: number) => {
    await getPostAll(e)
  }

  const del = async (id: string) => {
    await deletePostApi(id)
    window.$message.success('删除成功')
    await getPostAll(1)
  }
  const getPostAll = async (page: number) => {
    loading.value = true
    const res = await postAllApi({
      page,
      size: 50,
      keyword: keyword.value,
      ...filterValues
    })
    data.value = res.data.data.map((item: postAllModel) => {
      item.status = PostStatusName[item.status] as any
      item.creatTime = dayjs(item.creatTime).format('YYYY-MM-DD HH:mm:ss')
      return item
    })
    pagination.pageCount = res.data.pageTotal
    pagination.pageSize = res.data.total
    loading.value = false
  }
</script>

<style scoped>
  :deep(.n-pagination) {
    padding-right: 10px;
  }
</style>
