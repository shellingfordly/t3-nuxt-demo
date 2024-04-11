<script setup lang="ts">
import { useGithubCommentStore } from "../stores/githubComment";
const githubCommentStore = useGithubCommentStore();

onMounted(githubCommentStore.getComments);
</script>
<template>
  <div>
    <ul>
      <li v-for="comment in githubCommentStore.comments">
        <CommentItem :comment="comment" :key="comment.id" />
      </li>
    </ul>
  </div>
</template>
<style scoped></style>
