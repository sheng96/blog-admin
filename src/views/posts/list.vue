<template>
  <div class="m-4 border-r-2 bg-white p-2"> 文章列表</div>
  <n-data-table
    ref="table"
    remote
    :columns="columns"
    :data="data"
    :loading="loading"
    :pagination="pagination"
    :row-key="rowKey"
    @update:page="handlePageChange"
  />
</template>
<script setup lang="ts">
  import { h, onBeforeMount, reactive, ref } from 'vue'
  import {
    DataTableColumn,
    NButton,
    NDataTable,
    NTag,
    NPopconfirm
  } from 'naive-ui'
  import { deletePostApi, postAllApi } from '@/api/post'
  import { RouterLink } from 'vue-router'
  import dayjs from 'dayjs'
  import { postAllModel } from '@/api/model/postModel'
  import { PostStatusName } from '@/common/post-status'

  const columns: Array<DataTableColumn> = [
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
      key: 'status'
    },
    {
      title: '标签',
      width: 140,
      align: 'center',
      key: 'tags',
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
  ]
  const data = ref<any[]>([])
  const pagination: { page: number; pageCount: number; pageSize: number } =
    reactive({
      page: 2,
      pageCount: 10,
      pageSize: 10
    })
  const loading = ref(false)
  onBeforeMount(async () => {
    loading.value = true
    const res = await postAllApi()
    data.value = res.data.data.map((item: postAllModel) => {
      item.status = PostStatusName[item.status] as any
      item.creatTime = dayjs(item.creatTime).format('YYYY-MM-DD HH:mm:ss')
      return item
    })
    pagination.pageCount = res.data.pageTotal
    pagination.pageSize = res.data.total
    loading.value = false
  })
  const rowKey = (e: { id: string }): number | string => e.id

  const handlePageChange = (e: any) => {
    console.log(e)
  }

  const del = async (id: string) => {
    await deletePostApi(id)
    window.$message.success('删除成功')
  }
</script>

<style scoped></style>
