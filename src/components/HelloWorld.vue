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
  useFetch("https://api.github.com/repos/shellingfordly/vue-comment/issues", {
    headers: {
      Authorization: "token " + import.meta.env.VITE_GITHUB_TOKEN,
    },
  }).get();
}
</script>

<template>
  <SignInButton v-if="!user.isSignedIn" />
  <UserButton v-else />

  <button mt5 mb5 btn @click="onCreateIssue">create issue</button>
  <button mb5 btn @click="onCreateComment">create comment</button>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
