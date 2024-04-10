<script setup lang="ts">
defineProps<{ comment: GithubCommentItem }>();
</script>

<template>
  <div flex mb5>
    <img class="mr-5 w-10 h-10 rd-10" :src="comment.author.avatarUrl" alt="" />

    <div class="box relative w-150 b-default">
      <div class="p2 b-b-1 b-gray-200 dark:b-gray-700">
        <span mr-2>{{ comment.author.login }}</span>
        <span font-size-3 c-gray> commented on Jan 13, 2019 </span>
      </div>
      <div p4>
        <div class="markdown-body" v-html="comment.bodyHTML"></div>
      </div>
      <CommentReaction :commentId="comment.id" />
    </div>
  </div>
</template>

<style scoped>
.box::after {
  --at-apply: bg-white dark:bg-black;
  position: absolute;
  top: 12.5px;
  right: 100%;
  left: -8px;
  display: block;
  width: 8px;
  height: 16px;
  pointer-events: none;
  content: " ";
  clip-path: polygon(0 50%, 100% 0, 100% 100%);
  margin-left: 1px;
}

.box::before {
  --at-apply: bg-gray-200 dark:bg-gray-700;
  display: block;
  position: absolute;
  top: 12.5px;
  right: 100%;
  left: -9px;
  width: 8px;
  height: 16px;
  pointer-events: none;
  content: " ";
  clip-path: polygon(0 50%, 100% 0, 100% 100%);
}
</style>
