<script setup lang="ts">
import { SignInButton, UserButton, useUser } from "vue-clerk";
import { onMounted } from "vue";
import { ref } from "vue";
import { useFetch } from "@vueuse/core";
import { Octokit } from "octokit";
const user = useUser();
const comments = ref<any[]>([]);

const octokit = new Octokit({
  auth: import.meta.env.VITE_GITHUB_TOKEN,
});

onMounted(async () => {
  const { data } = await useFetch(
    "https://api.github.com/repos/shellingfordly/vue-comment/issues/1/comments",
    {
      headers: {
        Authorization: "token " + import.meta.env.VITE_GITHUB_TOKEN,
      },
    }
  ).get();
  console.log(data);
  comments.value = JSON.parse(data.value as string) as any[];
});

function onCreateIssue() {
  octokit.rest.issues.create({
    owner: "shellingfordly",
    repo: "vue-comment",
    title: "test issue",
    body: "this is test issue using Octokit!",
  });
}

function onCreateComment() {
  useFetch(
    "https://api.github.com/repos/shellingfordly/vue-comment/issues/1/comments",
    {
      headers: {
        Authorization: "token " + import.meta.env.VITE_GITHUB_TOKEN,
      },
    }
  ).post({
    body: "test",
  });
}
</script>

<template>
  <SignInButton v-if="!user.isSignedIn" />
  <UserButton v-else />

  <button @click="onCreateIssue">create issue</button>
  <button @click="onCreateComment">create comment</button>

  <div>
    <ul>
      <li v-for="comment in comments">
        <div>user: {{ comment.user.login }}</div>
        <div>comment: {{ comment.body }}</div>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
