<template>
  <div class="flex justify-between mb-2">
    <div class="text-xl text-black">{{ postForm.title }}</div>
    <div>
      <NButton>预览</NButton>
      <NButton type="info" class="ml-2" @click="showModal = true">
        发布</NButton
      >
    </div>
  </div>
  <div class="h-full">
    <NInput
      v-model:value="postForm.title"
      type="text"
      placeholder="请输入标题"
      size="large"
      class="mb-5"
    />
    <!--    <div id="editor"></div>-->
    <Editor
      :value="postForm.content"
      :plugins="plugins"
      :locale="zhHans"
      :uploadImages="uploadImages"
      @change="handleChange"
    ></Editor>
  </div>
  <n-modal
    v-model:show="showModal"
    class="custom-card"
    preset="card"
    display-directive="show"
    :style="bodyStyle"
    title="文章发布"
    size="huge"
    :bordered="false"
  >
    <n-tabs type="card" :bar-width="28">
      <n-tab-pane name="chap1" tab="常规">
        <n-form
          ref="formRef"
          :label-width="84"
          label-placement="left"
          label-align="left"
          size="large"
        >
          <n-form-item label="文章标题：" path="user.name">
            <n-input v-model:value="postForm.title" placeholder="文章标题" />
          </n-form-item>
          <n-form-item label="标签：" path="user.name">
            <n-select
              v-model:value="selectValue"
              filterable
              multiple
              max-tag-count="responsive"
              tag
              :options="options"
              placeholder="请选择"
            />
          </n-form-item>
          <n-form-item label="摘要：" path="user.name">
            <n-input
              v-model:value="postForm.summary"
              type="textarea"
              placeholder="文章标题"
            />
          </n-form-item>
        </n-form>
      </n-tab-pane>
      <!--      <n-tab-pane name="chap2" tab="常规"></n-tab-pane>-->
    </n-tabs>
    <template #footer>
      <div class="flex align-middle justify-end">
        <NButton type="warning" @click="submit(statusEnum.draft)"
          >保存草稿</NButton
        >
        <NButton class="ml-2" type="info" @click="submit(statusEnum.publish)"
          >发布</NButton
        >
      </div>
    </template>
  </n-modal>
</template>

<script setup lang="ts">
  import {
    NButton,
    NInput,
    NModal,
    NTabs,
    NTabPane,
    NForm,
    NFormItem,
    NSelect
  } from 'naive-ui'
  import { onMounted, reactive, ref } from 'vue'

  import { creatTagApi, getTagAllApi } from '@/api/tag'
  import { creatPostApi, postDetailApi, uploadImagesApi } from '@/api/post'
  import { statusEnum } from '@/api/model/postModel'
  import { useRoute } from 'vue-router'
  import { userStore } from '@/store/modules/user'

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
  const uploadImages = async (files: File[]) => {
    console.log(files)
    let formData = new FormData()
    formData.append('files', files[0])
    let res: any = await uploadImagesApi(formData)
    return res.data.map((item: any) => {
      return {
        url: import.meta.env.VITE_BASE_URL + '/image/' + item.filename,
        alt: item.originalname,
        title: item.originalname
      }
    })
  }

  const store = userStore()

  const bodyStyle = {
    width: '600px'
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
  let postDetail: any
  if (route.query.id) {
    const res = await postDetailApi(route.query.id as string)
    postDetail = res.data
    selectValue.value = (postDetail.tags as any[]).filter((item) =>
      options.value.find((tag) => tag.label === item)
    )
  }

  const postForm = reactive({
    title: postDetail?.title ?? '',
    content: postDetail?.content ?? '',
    summary: postDetail?.summary ?? ''
  })

  onMounted(() => {})

  const handleChange = (value: string) => {
    postForm.content = value
  }

  async function submit(status: statusEnum) {
    let tagId: number[] = []
    let tagName: string[] = []
    selectValue.value.forEach((item) => {
      if (typeof item === 'string') {
        let obj = options.value.find((value) => value.label === item)
        if (!obj) {
          tagName.push(item)
        }
      } else {
        tagId.push(item)
      }
    })
    const newTags = await creatTagApi([...new Set(tagName)])
    let newTagId = newTags.data.map((item) => item.id)
    await creatPostApi({
      title: postForm.title,
      content: postForm.content,
      contentHtml: '',
      summary: postForm.summary,
      status: statusEnum[status],
      tags: [...new Set([...tagId, ...newTagId])]
    })
    showModal.value = false
  }
</script>

<style scoped>
  :deep(.bytemd) {
    height: calc(100vh - 200px);
  }
  :deep(.markdown-body) ul li {
    list-style: disc;
  }
  :deep(.markdown-body) ol li {
    list-style: decimal;
  }

</style>
