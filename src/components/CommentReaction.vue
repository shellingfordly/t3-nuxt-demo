<script setup lang="ts">
import { useGithubCommentStore } from "../stores/githubComment";

const props = defineProps<{ commentId: string }>();

const commentReactionIcon: Record<GithubCommentReaction, string> = {
  THUMBS_UP: "👍",
  THUMBS_DOWN: "👎",
  HEART: "❤️",
  EYES: "👀",
  LAUGH: "😄",
  HOORAY: "🎉",
  CONFUSED: "😕",
  ROCKET: "🚀",
};
const show = ref(false);
const githubCommentStore = useGithubCommentStore();

function onClickShow(event: Event) {
  event.stopPropagation();

  show.value = !show.value;
}

function onClickReaction(event: Event, reaction: GithubCommentReaction) {
  event.stopPropagation();

  githubCommentStore.reactionComment(props.commentId, reaction);
}

useEventListener(
  "click",
  () => {
    if (show.value) show.value = false;
  },
  false
);
</script>

<template>
  <div relative>
    <div
      v-show="show"
      class="flex absolute top--12 left-3 p2 space-x-1 b-default shadow-2xl bg-white"
    >
      <div
        class="hover:bg-gray-200 cursor-pointer py1 px2 rounded"
        v-for="(icon, key) in commentReactionIcon"
        @click="(e) => onClickReaction(e, key)"
      >
        {{ icon }}
      </div>
    </div>
    <div p3>
      <div
        class="flex-center-center w-5 h-5 b-1 b-gray rd-100 cursor-pointer hover:bg-gray-200 hover:dark:bg-gray-700"
        @click="onClickShow"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 256 256"
        >
          <path
            fill="gray"
            d="M173.19 155c-9.92 17.16-26.39 27-45.19 27s-35.27-9.84-45.19-27a6 6 0 0 1 10.38-6c7.84 13.54 20.2 21 34.81 21s27-7.46 34.81-21a6 6 0 1 1 10.38 6M230 128A102 102 0 1 1 128 26a102.12 102.12 0 0 1 102 102m-12 0a90 90 0 1 0-90 90a90.1 90.1 0 0 0 90-90M92 118a10 10 0 1 0-10-10a10 10 0 0 0 10 10m72-20a10 10 0 1 0 10 10a10 10 0 0 0-10-10"
          />
        </svg>
      </div>
    </div>
  </div>
</template>
<style scoped></style>
