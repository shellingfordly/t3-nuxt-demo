<script setup lang="ts">
const { comments } = useComments();
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
