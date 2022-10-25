<template>
  <div class="flex justify-between mb-2">
    <div class="text-xl text-black">{{ title }}</div>
    <div>
      <NButton>预览</NButton>
      <NButton type="info" class="ml-2" @click="showModal = true">
        发布</NButton
      >
    </div>
  </div>
  <div class="h-full">
    <NInput
      v-model:value="title"
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
          :size="size"
        >
          <n-form-item label="文章标题：" path="user.name">
            <n-input v-model:value="title" placeholder="文章标题" />
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
              @update:value="change"
            />
          </n-form-item>
          <n-form-item label="摘要：" path="user.name">
            <n-input
              v-model:value="title"
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
  import { onMounted, ref } from 'vue'
  import Editor from 'vditor'
  import 'vditor/dist/index.css'
  import { creatTagApi, getTagAllApi } from '@/api/tag'
  import { creatPostApi } from '@/api/post'

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

  const title = ref('这是一个标题默认值')
  const vditor = ref<Editor | null>(null)

  onMounted(() => {
    vditor.value = new Editor('editor', {
      height: '90%',
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
      status: 'draft',
      tags:[...new Set([...tagId,...newTagId])]
    })
    console.log(tagId, tagName)
    console.log(vditor.value?.getValue())
    console.log(vditor.value?.getHTML())
  }
</script>

<style scoped lang="scss">
  .mavonEditor {
    width: 100%;
    height: 100%;
  }
</style>
<style>
  ol,
  ul {
    list-style: null;
  }

  /*#editor {*/
  /*  margin: auto;*/
  /*  width: 80%;*/
  /*  !*height: 980px;*!*/
  /*}*/
</style>