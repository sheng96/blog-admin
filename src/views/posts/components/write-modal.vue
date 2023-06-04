<template>
  <n-modal
    :bordered="false"
    :show="showModal"
    :style="bodyStyle"
    class="custom-card"
    display-directive="show"
    preset="card"
    size="huge"
    title="文章发布"
    @update-show="emit('update:showModal', false)"
  >
    <n-tabs :bar-width="28" type="card">
      <n-tab-pane name="chap1" tab="常规">
        <n-form
          ref="formRef"
          :label-width="84"
          label-align="left"
          label-placement="left"
          size="large"
        >
          <n-form-item label="文章标题" path="user.name">
            <n-input v-model:value="postForm.title" placeholder="文章标题" />
          </n-form-item>
          <n-form-item label="文章封面" path="user.name">
            <!--suppress TypeScriptValidateTypes -->
            <n-upload
              :max="1"
              accept="image/*"
              :action="uploadFileUrl"
              :default-file-list="[
                {
                  id: 'a',
                  name: 'head',
                  status: 'finished',
                  url: 'http://127.0.0.1:8888/files/1685812256198.png'
                }
              ]"
              list-type="image-card"
              :custom-request="customRequest"
            >
              点击上传
            </n-upload>
          </n-form-item>
          <n-form-item label="标签：" path="user.name">
            <n-select
              v-model:value="selectValue"
              :options="options"
              filterable
              max-tag-count="responsive"
              multiple
              placeholder="请选择"
              tag
            />
          </n-form-item>
          <n-form-item label="摘要" path="user.name">
            <n-input
              v-model:value="postForm.summary"
              placeholder="文章标题"
              type="textarea"
            />
          </n-form-item>
        </n-form>
      </n-tab-pane>
    </n-tabs>
    <template #footer>
      <div class="flex align-middle justify-end">
        <NButton type="warning" @click="submit(PostStatus.DRAFT)"
          >保存草稿
        </NButton>
        <NButton class="ml-2" type="info" @click="submit(PostStatus.PUBLISH)"
          >发布
        </NButton>
      </div>
    </template>
  </n-modal>
</template>
<script lang="ts" setup>
  import { useRoute, useRouter } from 'vue-router'
  import { creatPostApi, updatePostApi } from '@/api/post'
  import {
    NButton,
    NInput,
    NModal,
    NTabs,
    NTabPane,
    NForm,
    NFormItem,
    NSelect,
    NUpload
  } from 'naive-ui'
  import type { UploadCustomRequestOptions } from 'naive-ui'
  import { creatTagApi, getTagAllApi } from '@/api/tag'
  import { uploadImagesApi } from '@/api/post'
  import { ref, watch } from 'vue'
  import { PostStatus } from '@/common/post-status'
  //   弹框样式
  let bodyStyle = {
    width: '600px'
  }

  const uploadFileUrl = import.meta.env.VITE_BASE_URL + '/post/upload'

  interface Props {
    showModal: boolean
    postForm: {
      id: number
      title: string
      content: string
      summary: string
      status: PostStatus
      tag: number[]
      cover: string
    }
  }

  //   定义子组件的 props
  const props = defineProps<Props>()
  const postForm = ref(Object.assign({}, props.postForm))

  // 定义一个函数，由父组件调用，用于更新子组件的 postForm
  const updatePostForm = (value: Props['postForm']) => {
    postForm.value = Object.assign({}, value)
  }

  // 当postForm.title改变时，触发
  watch(
    () => postForm.value.title,
    () => {
      console.log('postForm.title改变了')

      emit('update:postForm', postForm.value)
    }
  )
  // 定义子组件的 emit
  const emit = defineEmits<{
    (e: 'update:showModal', value: boolean): void
    (e: 'update:postForm', value: Props['postForm']): void
  }>()
  //  通过 expose 暴露给父组件
  defineExpose({
    updatePostForm
  })

  const route = useRoute()

  const router = useRouter()

  const selectValue = ref([])

  async function submit(status: PostStatus) {
    let tagId: number[] = []
    for (const item of selectValue.value) {
      if (typeof item === 'string') {
        const newTags = await creatTagApi(item)
        tagId.push(newTags.data.id)
      } else {
        tagId.push(item)
      }
    }
    let data = {
      title: props.postForm.title,
      content: props.postForm.content,
      summary: props.postForm.summary,
      status: status,
      tag: tagId
    }
    if (route.query.id) {
      await updatePostApi(route.query.id as string, data)
    } else {
      await creatPostApi(data)
    }
    emit('update:showModal', false)
    // showModal.value = false
    // useMessage
    window.$message.success('提交成功', {
      //弹出关闭后开始跳转页面
      onLeave: () => {
        router.replace({ name: 'list' })
      }
    })
  }

  let options = ref<{ label: string; value: number | string }[]>([])

  async function getTag() {
    options.value = []
    const tag = await getTagAllApi()
    tag.data.forEach((item) => {
      options.value.push({
        label: item.name,
        value: item.id
      })
    })
  }
  await getTag()

  //  上传图片
  const customRequest = async ({ file }: UploadCustomRequestOptions) => {
    let formData = new FormData()
    formData.append('files', file.file as File)
    let res: any = await uploadImagesApi(formData)
    postForm.value.cover = import.meta.env.VITE_BASE_URL + res.data[0].url
    console.log(res)
  }
</script>

<style scoped></style>
