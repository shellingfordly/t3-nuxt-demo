<script setup lang="ts">
import { useGithubCommentStore } from "./stores/githubComment";

const isDark = useDark();
const githubCommentStore = useGithubCommentStore();
const showMore = computed(
  () =>
    githubCommentStore.comments.length > 0 &&
    githubCommentStore.comments.length < githubCommentStore.commentTotalCount
);
</script>

<template>
  <!-- <HelloWorld /> -->
  <div container ma pb10 lt-sm:p5>
    <div p5 space-x-4>
      <span
        class="hc-gray i-material-symbols:light-mode dark:i-material-symbols:dark-mode"
        @click="isDark = !isDark"
        title="change theme"
      />
      <a
        href="https://github.com/shellingfordly/vue-comment"
        target="_blank"
        class="hc-gray i-mdi:github"
        title="github"
      />
    </div>

    <div flex-center-between py2 mb3 b-b-default b-b-1>
      <div>
        <span>comments {{ githubCommentStore.commentTotalCount }}</span>
      </div>
      <div>
        Powered by
        <a
          class="c-blue dark:c-blue-700 a-blue"
          href="https://github.com/shellingfordly/"
          target="_blank"
        >
          GitHub
        </a>
        &
        <a
          class="c-blue dark:c-blue-700 a-blue"
          href="https://github.com/shellingfordly/vue-comment"
          target="_blank"
        >
          vue-comment
        </a>
      </div>
    </div>
    <CommentHeader />
    <CommentList />
    <div v-if="showMore" flex-center-center p5>
      <button p2 c-gray a-blue @click="githubCommentStore.updateComments">
        <span>VIEW MORE</span>
        <span i-material-symbols:keyboard-arrow-down />
      </button>
    </div>
  </div>
</template>
