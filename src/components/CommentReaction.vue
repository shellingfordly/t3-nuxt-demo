<script setup lang="ts">
import { useGithubCommentStore } from "../stores/githubComment";

const props = defineProps<{
  commentId: string;
  reactionGroups: GithubCommentReactionGroup[];
}>();

const commentReactionIcon: Record<GithubCommentReactionType, string> = {
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
const reactionGroups = computed(() =>
  props.reactionGroups.filter((item) => item.users.totalCount > 0)
);

function onClickShow(event: Event) {
  event.stopPropagation();

  show.value = !show.value;
}

function onClickReaction(event: Event, reaction: GithubCommentReactionType) {
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
    <div flex-center-start p3>
      <div
        class="flex-center-center w-5 h-5 mb1 b-1 b-gray rd-100 cursor-pointer hover:bg-gray-200 hover:dark:bg-gray-700"
        @click="onClickShow"
      >
        <span c-gray i-material-symbols:sentiment-satisfied-outline-rounded />
      </div>
      <div class="flex flex-wrap space-x-2 ml2">
        <div
          class="px2 mb1 rd-4 cursor-pointer b-default hover:b-gray-400 hover:dark:b-gray-400"
          v-for="item in reactionGroups"
        >
          <span mr2>{{ commentReactionIcon[item.content] }}</span>
          <span>{{ item.users.totalCount }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
