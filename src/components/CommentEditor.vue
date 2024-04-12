<script setup lang="ts">
import { useGithubCommentStore } from "../stores/githubComment";

const emit = defineEmits<{
  update: [comment: GithubCommentItem];
  cancel: [void];
}>();
const props = defineProps<{ commentId?: string; commentBody?: string }>();
const isUpdateComment = computed(() => !!props.commentId);
const githubCommentStore = useGithubCommentStore();
const createLoading = ref(false);
const content = ref("");

watchEffect(() => {
  if (props.commentBody) {
    content.value = props.commentBody;
  }
});

async function createComment() {
  const success = await githubCommentStore.createComment(content.value, "");
  if (success) {
    await githubCommentStore.initComments();
  }
  content.value = "";
}

async function updateComment() {
  if (props?.commentId) {
    const data = await githubCommentStore.editorComment(props?.commentId, content.value);

    if (data) {
      emit("update", data);
      githubCommentStore.onUpdateComment(data);
    }
  }
}

async function onEditComment() {
  createLoading.value = true;

  console.log("edit");

  if (isUpdateComment.value) updateComment();
  else createComment();

  createLoading.value = false;
}
</script>
<template>
  <div flex>
    <textarea
      v-model="content"
      class="w-full h-20 p2 box-border b-1 rounded resize-none fs4"
    />
  </div>
  <div flex-center-end p2 space-x-2>
    <button v-if="isUpdateComment" btn-red @click="$emit('cancel')">Cancel</button>
    <button btn :disabled="createLoading" @click="onEditComment">
      <span v-if="createLoading" i-line-md:loading-alt-loop />
      <span>{{ isUpdateComment ? "Update Comment" : "Comment" }}</span>
    </button>
  </div>
</template>
