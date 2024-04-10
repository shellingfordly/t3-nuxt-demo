<script setup lang="ts">
import { SignInButton, UserButton, useUser } from "vue-clerk";
import { useGithubCommentStore } from "../stores/githubComment";

const user = useUser();
const content = ref("");
const githubCommentStore = useGithubCommentStore();

async function onPostComment() {
  const success = await githubCommentStore.postComment(content.value, "");
  if (success) {
    githubCommentStore.initComments();
  }
}
</script>
<template>
  <div flex>
    <div mr4>
      <SignInButton v-if="!user.isSignedIn" />
      <UserButton v-else />
    </div>

    <div flex-1>
      <h4 font-size-4 font-500 mb3>Add a comment</h4>
      <textarea
        v-model="content"
        class="w-full h-20 py2 px4 mb5 box-border b-1 rounded resize-none fs4"
      />
    </div>
  </div>
  <div flex-center-end mb5>
    <button btn @click="onPostComment">Comment</button>
  </div>
</template>
