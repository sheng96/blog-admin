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
      ref="table"
      max-height="66vh"
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
  <!--  弹框，展示用户的详情信息-->
  <n-modal
    v-model:show="showModal"
    :title="userDetail.userName + '的详情信息'"
    preset="dialog"
  >
    <div class="flex flex-col bg-white">
      <div class="flex flex-row justify-between">
        <div class="flex flex-col">
          <div class="flex flex-row">
            <div class="w-32">用户名：</div>
            <div>{{ userDetail.userName }}</div>
          </div>
          <div class="flex flex-row">
            <div class="w-32">邮箱：</div>
            <div>{{ userDetail.email }}</div>
          </div>
          <div class="flex flex-row">
            <div class="w-32">权限：</div>
            <div>{{ getPermissionName(userDetail.role) }}</div>
          </div>
        </div>
        <div class="flex flex-col">
          <div class="flex flex-row">
            <div class="w-32">注册时间：</div>
            <div>{{ userDetail.creatTime }}</div>
          </div>
          <!--          <div class="flex flex-row">-->
          <!--            <div class="w-32">最后登录时间：</div>-->
          <!--            <div>{{ userDetail.lastLoginTime }}</div>-->
          <!--          </div>-->
        </div>
      </div>
      <div class="flex flex-row justify-between">
        <div class="flex flex-col">
          <!--          <div class="flex flex-row">-->
          <!--            <div class="w-32">个人简介：</div>-->
          <!--            <div>{{ userDetail.introduction }}</div>-->
          <!--          </div>-->
          <!--          <div class="flex flex-row">-->
          <!--            <div class="w-32">个人网站：</div>-->
          <!--            <div>{{ userDetail.website }}</div>-->
          <!--          </div>-->
          <!--        </div>-->
          <div class="flex flex-col">
            <div class="flex flex-row">
              <div class="w-32">头像：</div>
              <div>
                <img :src="userDetail.avatar" alt="" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </n-modal>
</template>
<script setup lang="ts">
  import { h, onBeforeMount, reactive, ref } from 'vue'
  import { getPermissionName, UserPermission } from '@/common/blog.config'
  import {
    DataTableColumns,
    NButton,
    NDataTable,
    NTag,
    NPopconfirm,
    NInput,
    NInputGroup,
    DataTableFilterState,
    NModal
  } from 'naive-ui'
  import { deleteUserApi, getUserListApi, getUserApi } from '@/api/user'
  import { UserListData } from '@/api/model/userModel'
  import dayjs from 'dayjs'

  const keyword = ref('')
  let filterValues: DataTableFilterState = {
    status: null
  }

  const columns: DataTableColumns<UserListData> = reactive([
    {
      type: 'selection'
    },
    {
      title: '用户名',
      // align: 'center',
      width: 180,
      key: 'userName'
    },
    {
      title: '邮箱',
      // align: 'center',
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
            default: () => getPermissionName(row.role)
          }
        )
      }
    },
    {
      title: '注册时间',
      align: 'center',
      key: 'creatTime',
      render(row) {
        return h('div', {}, dayjs(row.creatTime).format('YYYY-MM-DD HH:mm:ss'))
      }
    },
    {
      title: '操作',
      align: 'center',
      key: 'auth',
      render(row) {
        // 为按钮绑定事件
        return [
          h(
            NButton,
            {
              onClick() {
                getUser(row.id)
              },
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
                del(row.id)
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

  const del = async (id: number) => {
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

  //   创建用户数据变量，获取用户数据
  const userDetail: UserListData = reactive({
    id: 0,
    userName: '',
    email: '',
    role: UserPermission.User,
    creatTime: ''
  })
  const getUser = async (id: number) => {
    const res = await getUserApi(id)
    userDetail.id = res.data.id
    userDetail.userName = res.data.userName
    userDetail.email = res.data.email
    userDetail.role = res.data.role
    userDetail.creatTime = res.data.creatTime
    showModal.value = true
  }
  const showModal = ref(false)
</script>

<style scoped>
  :deep(.n-pagination) {
    padding-right: 10px;
  }
</style>
