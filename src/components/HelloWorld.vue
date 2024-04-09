<script setup lang="ts">
import { SignInButton, UserButton, useUser } from "vue-clerk";
import { Octokit } from "octokit";

const user = useUser();

const octokit = new Octokit({
  auth: import.meta.env.VITE_GITHUB_TOKEN,
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
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
