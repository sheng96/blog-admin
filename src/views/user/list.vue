<template>
  <div class="my-2 bg-white p-2">
    <n-input-group>
      <n-input
        v-model:value="keyword"
        :style="{ width: '80%' }"
        placeholder="请输入搜索标题"
        @keyup.enter="getUserList(1)"
      />
      <n-button type="primary" @click="getUserList(1)"> 搜索 </n-button>
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
    DataTableFilterState
  } from 'naive-ui'
  import { deleteUserApi, getUserListApi } from '@/api/user'

  const keyword = ref('')
  let filterValues: DataTableFilterState = {
    status: null
  }

  const columns: Array<DataTableColumn> = reactive([
    {
      type: 'selection'
    },
    {
      title: '用户名',
      align: 'center',
      key: 'userName'
    },
    {
      title: '邮箱',
      align: 'center',
      key: 'email'
    },
    {
      title: '权限',
      width: 140,
      align: 'center',
      key: 'role',
      filter: true,
      filterMode: 'and',
      filterMultiple: false,
      render(row) {
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
            default: () => row.role
          }
        )
      }
    },
    {
      title: '创建时间',
      align: 'center',
      key: 'creatTime',
      render() {
        return h('div', '未开发')
      }
    },
    {
      title: '操作',
      align: 'center',
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
              default: () => '查看'
            }
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
    await getUserList(1)
  })

  //表格头部筛选结果
  const changeFiters = (filters: DataTableFilterState) => {
    filterValues = filters
    getUserList(1)
  }
  const rowKey = (e: { id: string }): number | string => e.id

  const handlePageChange = async (e: number) => {
    await getUserList(e)
  }

  const del = async (id: string) => {
    await deleteUserApi(id)
    window.$message.success('删除成功')
    await getUserList(1)
  }
  const getUserList = async (page: number) => {
    loading.value = true
    const res = await getUserListApi({
      page,
      size: 50,
      keyword: keyword.value,
      ...filterValues
    })
    data.value = res.data.data
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
