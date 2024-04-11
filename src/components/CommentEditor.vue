<script setup lang="ts">
import { useGithubCommentStore } from "../stores/githubComment";

const content = ref("");
const githubCommentStore = useGithubCommentStore();
const user = ref<Partial<GithubUserItem>>({});

onMounted(async () => {
  user.value = await githubCommentStore.githubComment.getUser();
});

async function onPostComment() {
  const success = await githubCommentStore.postComment(content.value, "");
  if (success) {
    githubCommentStore.getComments();
  }
}

function onLogin() {
  githubCommentStore.loginAuthorize();
}

</script>
<template>
  <div flex>
    <div class="flex-center-center w-12 h-12 mr4 font-size-10 c-gray-500 dark:c-gray-300 cursor-pointer" title="Login">
      <span v-if="!user.login" i-mdi:github @click="onLogin" />
      <a v-else block :href="user.url" target="_blank">
        <img class="w-10 h-10 rd-10" v-lazy="user.avatarUrl" alt="" />
      </a>
    </div>

    <div flex-1>
      <h4 font-size-4 font-500 mb3>Add a comment</h4>
      <textarea v-model="content" class="w-full h-20 py2 px4 mb5 box-border b-1 rounded resize-none fs4" />
    </div>
  </div>
  <div flex-center-end mb5>
    <button btn @click="onPostComment">Comment</button>
  </div>
</template>
