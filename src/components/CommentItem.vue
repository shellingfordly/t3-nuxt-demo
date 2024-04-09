<script setup lang="ts">
defineProps<{ comment: any }>();
</script>
<template>
  <div>
    <img w-10 h-10 rd-10 :src="comment.user.avatar_url" alt="" />
  </div>
  <div>user: {{ comment.user.login }}</div>
  <div v-html="comment.body"></div>
</template>
