<template>
  <div class="flex pt-1">
    <div v-for="item in tagsTitle" :key="item" class="card-box pr-2">
      <NCard
        :title="item"
        content-style="font-size:30px;font-weight:700px"
        header-style="font-size:14px"
      >
        <template #header-extra>
          <NIcon :component="PlusOutlined"></NIcon>
        </template>
        <n-number-animation
          ref="numberAnimationInstRef"
          :from="0"
          :to="12039"
        />
      </NCard>
    </div>
  </div>
  <div class="flex pb-1">
    <div class="status-box pr-2">
      <NCard title="新动态" content-style="font-size:16px;">
        <n-tabs type="segment" animated>
          <n-tab-pane name="post" tab="最近文章">最近文章</n-tab-pane>
          <n-tab-pane name="comment" tab="最近评论">最近评论</n-tab-pane>
        </n-tabs>
      </NCard>
    </div>
    <div class="status-box pr-2">
      <NCard
        title="随笔"
        content-style="font-size:16px;"
        :segmented="{
          content: true
        }"
      >
        <n-input
          v-model:value="value"
          type="textarea"
          placeholder="写点什么吧"
        />
        <NButton class="mt-4" type="info">发布</NButton>
      </NCard>
    </div>
  </div>
</template>

<script setup lang="ts">
  import {
    NButton,
    NCard,
    NIcon,
    NInput,
    NNumberAnimation,
    NTabPane,
    NTabs
  } from 'naive-ui'
  import { PlusOutlined } from '@vicons/antd'
  import { ref } from 'vue'

  const tagsTitle = ['文章', '评论', '阅读量', '建立天数']
  const value = ref('')
</script>

<style scoped lang="scss">
  .card-box {
    width: 25%;
  }

  .status-box {
    width: 50%;
  }

  .n-card {
    margin: 5px;
    display: inline-block;
  }
</style>
