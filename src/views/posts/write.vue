<template>
  <div class="flex flex-col h-full">
    <div class="flex flex-grow-0 justify-between mb-2 px-4 items-center">
      <NInput
        v-model:value="postForm.title"
        class=""
        placeholder="请输入标题"
        size="large"
        type="text"
      />
      <NButton class="ml-2 flex-grow-0" type="info" @click="updateSubPostForm">
        发布
      </NButton>
    </div>
    <Editor
      :locale="zhHans"
      :plugins="plugins"
      :upload-images="uploadImages"
      :value="postForm.content"
      class="h-full"
      @change="handleChange"
    ></Editor>
  </div>
  <Write-Modal
    ref="childrenRef"
    v-model:show-modal="showModal"
    v-model:post-form="postForm"
  />
</template>

<script lang="ts" setup>
  import { NButton, NInput } from 'naive-ui'
  import { ref } from 'vue'

  import { getTagAllApi } from '@/api/tag'
  import { postDetailApi, uploadImagesApi } from '@/api/post'
  import { useRoute } from 'vue-router'

  import { Editor } from '@bytemd/vue-next'
  import breaks from '@bytemd/plugin-breaks'
  import frontmatter from '@bytemd/plugin-frontmatter' // 头部元信息
  import gemoji from '@bytemd/plugin-gemoji' // emoji😊 代码
  import gfm from '@bytemd/plugin-gfm' // 超链接、删除线、表格、任务列表
  import highlight from '@bytemd/plugin-highlight'
  import math from '@bytemd/plugin-math' // 数学公式
  import mediumZoom from '@bytemd/plugin-medium-zoom'
  import mermaid from '@bytemd/plugin-mermaid' // 图表 / 流程图
  import 'bytemd/dist/index.min.css' // bytemd 基础样式
  import zhHans from 'bytemd/locales/zh_Hans.json'
  import mermaid_zhHans from '@bytemd/plugin-mermaid/locales/zh_Hans.json'
  import math_zhHans from '@bytemd/plugin-math/locales/zh_Hans.json'
  import gfm_zhHans from '@bytemd/plugin-gfm/locales/zh_Hans.json'
  import 'github-markdown-css/github-markdown.css'
  import 'highlight.js/styles/vs.css'
  import WriteModal from './components/write-modal.vue'
  import { PostStatus } from '@/common/post-status'

  const plugins = [
    breaks(),
    frontmatter(),
    gemoji(),
    gfm({ locale: gfm_zhHans }),
    highlight(),
    math({ locale: math_zhHans }),
    mermaid({ locale: mermaid_zhHans }),
    mediumZoom()
  ]

  // 上传图片
  const uploadImages = async (files: File[]) => {
    let formData = new FormData()
    formData.append('files', files[0])
    let res: any = await uploadImagesApi(formData)
    return res.data.map((item: any) => {
      console.log(item)
      return {
        url: item.url,
        alt: item.originalname,
        title: item.originalname
      }
    })
  }
  const showModal = ref(false)
  const selectValue = ref<any[]>([])
  let options = ref<{ label: string; value: number | string }[]>([])
  const route = useRoute()

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
  let postDetail: any = {}
  if (route.query.id) {
    const res = await postDetailApi(route.query.id as string)
    postDetail = res.data
    selectValue.value = (postDetail.tag as any[]).filter((item) =>
      options.value.find((tag) => tag.label === item)
    )
  }

  // 表单数据
  const postForm = ref({
    title: postDetail?.title ?? '',
    content: postDetail?.content ?? '',
    id: postDetail?.id ?? '',
    tag: postDetail?.tag ?? [],
    summary: postDetail?.summary ?? '',
    cover: postDetail?.cover ?? '',
    status: postDetail?.status ?? PostStatus.PUBLISH
  })

  const handleChange = (value: string) => {
    postForm.value.content = value
  }

  // 定义子组件的 ref
  const childrenRef = ref<InstanceType<typeof WriteModal>>()
  // 同步更新子组件的表单数据
  const updateSubPostForm = () => {
    childrenRef.value?.updatePostForm(postForm.value)
    showModal.value = true
  }
</script>

<style scoped>
  :deep(.bytemd) {
    height: 100%;
  }

  :deep(.markdown-body) ul li {
    list-style: disc;
  }

  :deep(.markdown-body) ol li {
    list-style: decimal;
  }
</style>
