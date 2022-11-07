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
    <div id="editor"></div>
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
        <NButton type="warning">保存草稿</NButton>
        <NButton class="ml-2" type="info" @click="submit">发布</NButton>
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
  import { onBeforeUnmount, onMounted, reactive, ref } from 'vue'
  import Editor from 'vditor'
  import 'vditor/dist/index.css'
  import { creatTagApi, getTagAllApi } from '@/api/tag'
  import { creatPostApi } from '@/api/post'
  import { statusEnum } from '@/api/model/postModel'

  const bodyStyle = {
    width: '600px'
  }
  const showModal = ref(false)
  const selectValue = ref<any[]>([])
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
  getTag()

  const postForm = reactive({
    title: '',
    summary: ''
  })

  const vditor = ref<Editor | null>(null)
  onMounted(() => {
    vditor.value = new Editor('editor', {
      height: '33.2rem',
      toolbarConfig: {
        pin: true
      },
      counter: {
        enable: true
      },
      cache: {
        enable: false
      },
      after: () => {}
    })
  })
  onBeforeUnmount(() => {
    let dom = document.querySelector('#editor') as HTMLDivElement
    dom.innerHTML = ''
  })

  async function submit() {
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
      title: title.value,
      content: vditor.value?.getValue() as string,
      contentHtml: vditor.value?.getHTML() as string,
      summary: '这是一段测试摘要',
      status: statusEnum.draft,
      tags: [...new Set([...tagId, ...newTagId])]
    })
    showModal.value = false
  }
</script>

<style>
  ol,
  ul {
    list-style: null;
  }
</style>
