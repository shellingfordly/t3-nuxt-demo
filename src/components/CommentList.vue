<script setup lang="ts">
const { comments, initComments } = useComments();

onMounted(initComments);
</script>
<template>
  <div>
    <ul>
      <li v-for="comment in comments">
        <CommentItem :comment="comment" :key="comment.id" />
      </li>
    </ul>
  </div>
</template>
<style scoped></style>
