<template>
  <div class="pt-40">
    <n-result status="404" title="404 资源不存在" size="huge">
      <template #footer>
        <n-button>找点乐子吧</n-button>
      </template>
    </n-result>
  </div>
</template>

<script setup lang="ts">
  import { NButton, NResult } from 'naive-ui'
</script>

<style scoped></style>
