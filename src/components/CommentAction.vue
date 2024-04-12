<script setup lang="ts">
import { getEnv } from "../lib/utils/env";
import { useGithubCommentStore } from "../stores/githubComment";

const props = defineProps<{ comment: GithubCommentItem }>();
const githubCommentStore = useGithubCommentStore();
const show = ref(false);
const env = getEnv()
const isCommentAuthor = computed(() => env.githubAuthor === props.comment.author.login)

useEventListener(
  "click",
  () => {
    if (show.value) show.value = false;
  },
  false
);

function onClickShow(event: Event) {
  event.stopPropagation();

  show.value = !show.value;
}

function onCopyLink() {
  navigator.clipboard.writeText(props.comment.url);
}

function onQuoteComment() { }

async function onDeleteComment() {
  if (!window.confirm("Confirm to delete this comment ?")) return;
  const success = await githubCommentStore.deleteComment(props.comment.id);
  if (success) githubCommentStore.initComments();
}
</script>
<template>
  <div relative>
    <span hc-blue i-material-symbols:more-horiz @click="onClickShow"></span>

    <!-- Dropdown menu -->
    <div v-if="show"
      class="absolute left--28 w-35 z-10 text-sm b-default bg-white dark:bg-[#232323] divide-y dark:divide-gray-700 rounded-lg shadow">
      <ul class="py-2">
        <li>
          <a href="#" class="block px-4 py-2 hbg-gray" @click="onCopyLink"> Copy link </a>
        </li>
        <li>
          <a href="#" class="block px-4 py-2 hbg-gray" @click="onQuoteComment">
            Quote reply
          </a>
        </li>
      </ul>
      <div class="py-2" v-if="isCommentAuthor">
        <a href="#" class="block px-4 py-2 text-sm hbg-gray" @click="$emit('editor')">
          Edit
        </a>
        <!-- <a href="#" class="block px-4 py-2 text-sm hbg-gray" @click="onHideComment">
          Hide
        </a> -->
        <a href="#" class="block px-4 py-2 text-sm c-red hover:c-white hover:bg-red" @click="onDeleteComment">
          Delete
        </a>
      </div>
    </div>
  </div>
</template>
