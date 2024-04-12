<script setup lang="ts">
import { useGithubCommentStore } from "../stores/githubComment";

const content = ref("");
const githubCommentStore = useGithubCommentStore();
const user = computed(() => githubCommentStore.userInfo);
const createLoading = ref(false);

async function onCreateComment() {
  createLoading.value = true;
  const success = await githubCommentStore.createComment(content.value, "");
  if (success) {
    await githubCommentStore.initComments();
  }
  content.value = "";
  createLoading.value = false;
}

function onLogin() {
  githubCommentStore.loginAuthorize();
}

function onLogout() {
  githubCommentStore.logout();
}
</script>
<template>
  <div flex>
    <div
      class="flex-center-center w-12 h-12 mr4 font-size-10 c-gray-500 dark:c-gray-300 cursor-pointer"
      title="Login"
    >
      <span v-if="!user.login" i-mdi:github @click="onLogin" />
      <a v-else block :href="user.url" target="_blank">
        <img class="w-10 h-10 rd-10" v-lazy="user.avatarUrl" alt="" />
      </a>
    </div>

    <div flex-1>
      <h4 font-size-4 font-500 mb3>Add a comment</h4>
      <textarea
        v-model="content"
        class="w-full h-20 py2 px4 mb5 box-border b-1 rounded resize-none fs4"
      />
    </div>
  </div>
  <div flex-center-between mb5>
    <div pl16 font-size-3 c-gray>
      <template v-if="user.login">
        <a a-blue :href="user.url" target="_blank">{{ user.login }}</a>
        <span mx2>-</span>
        <a a-blue @click="onLogout">logout</a>
      </template>
    </div>

    <button btn :disabled="createLoading" @click="onCreateComment">
      <span v-if="createLoading" i-line-md:loading-alt-loop />
      <span>Comment</span>
    </button>
  </div>
</template>
