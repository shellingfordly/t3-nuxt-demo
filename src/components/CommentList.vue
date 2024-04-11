<script setup lang="ts">
import { useGithubCommentStore } from "../stores/githubComment";

const githubCommentStore = useGithubCommentStore();

onMounted(githubCommentStore.updateComments);
</script>
<template>
  <template v-for="comment in githubCommentStore.comments" :key="comment.id">
    <CommentItem :comment="comment" />
  </template>
</template>
<style scoped></style>
